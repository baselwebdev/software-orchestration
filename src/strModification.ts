export function replaceAll(text: string, needle: string, replacement: string): string {
    return text.split(needle).join(replacement);
}
