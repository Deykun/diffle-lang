export const normilzeWord = (text: string) => {
    return text.replaceAll('ą', 'a')
        .replaceAll('ć', 'c')
        .replaceAll('ę', 'e')
        .replaceAll('ł', 'l')
        .replaceAll('ń', 'n')
        .replaceAll('ó', 'o')
        .replaceAll('ś', 's')
        .replaceAll('ź', 'z')
        .replaceAll('ż', 'z');
};

export const getHasSpecialCharacters = (text: string) => {
    return text !== normilzeWord(text);
};
