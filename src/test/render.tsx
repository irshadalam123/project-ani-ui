import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/Toast';
import { setupStore, type TestPreloadedState } from '@/store/store';

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    preloadedState,
    ...options
  }: RenderOptions & { route?: string; preloadedState?: TestPreloadedState } = {},
) {
  const store = setupStore(preloadedState);
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <ToastProvider>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </ToastProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
