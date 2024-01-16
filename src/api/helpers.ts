export const getNormalizedKey = (word: string): string => {
    if (word.length === 2) {
        return '2ch';
    }

    if (word.length < 3) {
        return '';
    }

    if (word.length === 3) {
        return '3ch';
    }

    /*
        Nie" is the negation marker in Polish, and in Polish, negated adjectives have "nie" as a prefix.

        So it has it's own subkey system.
    */
    const key = word.startsWith('nie') ? word.slice(0, 6) : word.slice(0, 3);

    return key
        .replaceAll('ą', 'a')
        .replaceAll('ć', 'c')
        .replaceAll('ę', 'e')
        .replaceAll('ł', 'l')
        .replaceAll('ń', 'n')
        .replaceAll('ó', 'o')
        .replaceAll('ś', 's')
        .replaceAll('ź', 'z')
        .replaceAll('ż', 'z');
};

export const getIsKeyValid = (key: string = '') => {
    if (key.length === 3) {
        return true;
    }

    if (key.length >= 3 && key.length <= 6 && key.startsWith('nie')) {
        return true;
    }

    return false;
}
