export function keepIfInEnum<T>(
  value: string | undefined | number,
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
