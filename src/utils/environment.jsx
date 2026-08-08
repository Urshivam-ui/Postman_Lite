export function replaceVariables(text, envVars) {
    if (!text)
        return '';
    return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
        return envVars[key] !== undefined ? envVars[key] : `{{${key}}}`;
    });
}