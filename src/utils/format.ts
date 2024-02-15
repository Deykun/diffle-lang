export const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1);

export const formatLargeNumber = (value: number) => {
    // It isn't a currecy and Polish format looks nice ex. 3 211 300
    return new Intl.NumberFormat('pl-PL', { maximumSignificantDigits: 5 }).format(value);
};
