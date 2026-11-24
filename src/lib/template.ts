const TEMPLATE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/** Mirrors the backend renderer. Unknown placeholders stay in place. */
export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(TEMPLATE, (match, key: string) => {
    const value = variables[key];
    if (value === undefined) return match;
    return value;
  });
}

export const PREVIEW_VARIABLES = {
  first_name: 'Irshad',
  username: 'test_user',
} as const;
