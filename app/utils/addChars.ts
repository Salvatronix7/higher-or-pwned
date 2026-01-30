export const addChars = (str: string, char: string, count: number): string => {
    let actualCount = Math.floor((count - str.length) / 2);
    if (actualCount < 0) actualCount = 2;
    return `${Array(actualCount).join(char)}${str}${Array(actualCount).join(char)}`;
}