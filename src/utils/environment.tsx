export function replaceVariables(
  text: string,
  envVars: Record<string, string>
): string {
  if (!text) return '';
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return envVars[key] !== undefined ? envVars[key] : `{{${key}}}`;
  });
}