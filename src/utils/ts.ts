export function keepIfInEnum<T>(
  value: string | undefined | number | null,
  enumObject: { [key: string]: T },
) {
  if (!value) {
    return undefined;
  }

  if (Object.values(enumObject).includes((value as unknown) as T)) {
    return (value as unknown) as T;
  }

  return undefined;
}

export const getRandomItem = <T>(list: T[]): T | undefined => {
  if (list.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};
