export const addChars = (str: string, char: string, count: number): string => {
    return `${Array(count + 1).join(char)}${str}${Array(count + 1).join(char)}`;
}