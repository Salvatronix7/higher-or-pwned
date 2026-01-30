export const addChars = (char: string, count: number): string => {
    return `${Array(count).join(char)}`;
}