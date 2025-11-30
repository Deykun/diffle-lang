export const getUniqueArray = <T>(items: T[]): T[] => [...new Set(items)];
