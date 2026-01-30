export const getClassNames = (classNames: Record<string, boolean>) => {
    return Object.entries(classNames)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
        .join(' ');
}