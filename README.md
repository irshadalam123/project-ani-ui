# Instagram comment-to-DM automation

Frontend for a multi-tenant SaaS that connects Instagram professional accounts, turns comments into public replies and private DMs, and shows the conversations and activity that follow.

The UI talks to the FastAPI service in `apps/api`. It does not store Meta access tokens and it does not invent responses for endpoints the API does not have.

## Technology stack

- React 19 and TypeScript
- Vite
- Tailwind CSS 4
- Redux Toolkit and RTK Query
- React Router
- React Hook Form and Zod
- Lucide React
- Recharts
- Vitest and React Testing Library

## Architecture

```
src/
  api/            RTK Query endpoints injected into one base API
  store/          client state only: auth session, UI, selected workspace
  types/          request and response models aligned with the FastAPI schemas
  components/     ui, layout, charts, automation builder pieces
  features/       auth, onboarding, dashboard, instagram, automations,
                  inbox, contacts, analytics, billing, settings, help
  lib/            formatting, keyword matching, template rendering, API errors
```

Server data lives in the RTK Query cache. Redux slices hold only client state:

- `authSlice`: current user, bearer token, `isAuthenticated`
- `uiSlice`: sidebar, theme, mobile menu, notification preferences
- `workspaceSlice`: selected workspace and selected Instagram account

## Installation

From `apps/web`:

```bash
npm install
copy .env.example .env
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API origin, for example `http://localhost:8000` |
| `VITE_APP_NAME` | Product name shown in the shell |
| `VITE_FRONTEND_URL` | Browser origin, for example `http://localhost:5173` |

Do not put Meta secrets, JWT secrets, or database credentials in `VITE_` variables. Those belong on the API.

## Running locally

Start the API from `apps/api` on port 8000, then:

```bash
npm run dev
```

The app is served at http://localhost:5173. The API allows that origin in `CORS_ORIGINS`.

Demo login, when the API is started with `SEED_DEMO_DATA=true`:

`demo@example.com` / `DemoPassword123!`

## API configuration

`src/api/baseApi.ts` uses `fetchBaseQuery` with:

- `baseUrl` from `VITE_API_BASE_URL`
- `credentials: 'include'`
- `Authorization: Bearer <token>`
- `X-Workspace-Id` when a workspace is selected

Successful responses use `{ success, data }` and lists add `pagination`. Errors use `{ success: false, error: { code, message, request_id } }`.

A 401 from any route other than login or register clears the session and sends the browser to `/login`. Login failures stay on the form. There is no refresh loop.

## Authentication

The API returns an access token in the JSON body and expects it on later requests. It does not set an HTTP-only session cookie. The token is therefore kept in `localStorage` under `cmmdm.auth` so a refresh does not sign the user out. That is a consequence of the current API, not a place to store Instagram tokens. Instagram account payloads never include an access token.

## Instagram OAuth

Connect calls `GET /api/v1/instagram/connect` and assigns `window.location` to `authorization_url`. This app does not build a fake Meta screen.

Meta redirects to the API callback (`GET /api/v1/instagram/callback`). That route currently returns JSON. It does not redirect the browser to `VITE_FRONTEND_URL`. After a successful connection, return to the Instagram page and the account list will load. `VITE_FRONTEND_URL` is reserved for when the API redirects back to the app.

## Redux and RTK Query

Hooks such as `useGetAutomationsQuery` and `useCreateAutomationMutation` are the only way screens read and write server data. Creating, updating, activating, pausing, or deleting an automation invalidates the `Automations` tag. Disconnecting an account invalidates `Instagram`.

## Development workflow

```bash
npm run dev
npm run lint
npm run test
npm run type-check
npm run build
npm run preview
```

## Testing

Vitest covers the login and register forms, protected and guest routes, keyword matching, template variables, automation payload creation, the builder screen, the live preview, the action picker, the automation list error state, API error copy, auth state, and a few shared components.

## Build and deployment

`npm run build` type-checks and emits a static bundle in `dist/`. Host the bundle on any static host and set `VITE_API_BASE_URL` at build time to the public API origin. The API must allow that site in `CORS_ORIGINS`.

## Endpoints in use

| Area | Method and path |
| --- | --- |
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| Workspaces | `GET /api/v1/workspaces`, `POST /api/v1/workspaces` |
| Instagram | `GET /api/v1/instagram/connect`, `GET /api/v1/instagram/accounts`, `DELETE /api/v1/instagram/accounts/{id}` |
| Automations | `GET/POST /api/v1/automations`, `GET/PATCH/DELETE /api/v1/automations/{id}`, `POST .../activate`, `POST .../pause` |
| Executions | `GET /api/v1/executions`, `GET /api/v1/executions/{id}` |
| Contacts | `GET /api/v1/contacts`, `GET /api/v1/contacts/{id}` |
| Conversations | `GET /api/v1/conversations`, `GET /api/v1/conversations/{id}`, `GET .../messages` |
| Analytics | `GET /api/v1/analytics/overview` |

## Pending on the API

These screens are wired or reserved, and they say so in the UI instead of faking a result:

- Billing: `GET /api/v1/billing/subscription`, `GET /api/v1/billing/plans`, `POST /api/v1/billing/checkout`, `POST /api/v1/billing/cancel`
- Analytics time series and date ranges (`GET /api/v1/analytics/timeseries` is typed and not called)
- Search and status filters on automations and contacts (the API only accepts `page` and `page_size`)
- Choosing a specific post or reel
- DM buttons, and the extra actions marked coming soon
- Sending a message from the inbox
- Automation test execution on the server (the builder runs the same keyword rules locally)
- Profile updates, password changes, sessions, team invites, and email notification delivery
- OAuth callback redirect from the API back to this app
- Google sign-in and password reset

## Assumptions

- Bearer tokens must be retained by the browser because the API requires `Authorization`.
- One workspace from login is selected immediately. Extra workspaces can be created and switched.
- Conversion rate is private DMs divided by comments received. The API does not return a conversion field or a previous-period delta, so the UI does not show made-up percentages such as "+18.4%".
- Leads are shown exactly as `analytics.overview.leads`. That value is `0` in the current analytics service.
- DM counts on an automation come from execution history loaded from the API, not from a counter on the automation itself.
- `{{first_name}}` and `{{username}}` follow the API template rules. The preview uses Irshad and `test_user`.
