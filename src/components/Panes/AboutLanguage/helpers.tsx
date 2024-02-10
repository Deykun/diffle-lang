export const formatLargeNumber = (value: number) => {
    return new Intl.NumberFormat('pl-PL', { maximumSignificantDigits: 5 }).format(value);
};
