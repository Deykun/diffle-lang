// TODO: one source of truth for remove diacractics
export const normilzeWord = (text: string) => {
    return text.replaceAll('ą', 'a')
    .replaceAll('á', 'a')
    .replaceAll('ć', 'c')
    .replaceAll('č', 'c')
    .replaceAll('ď', 'd')
    .replaceAll('ę', 'e')
    .replaceAll('é', 'e')
    .replaceAll('ě', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ł', 'l')
    .replaceAll('ń', 'n')
    .replaceAll('ň', 'n')
    .replaceAll('ó', 'o')
    .replaceAll('ř', 'r')
    .replaceAll('ś', 's')
    .replaceAll('š', 's')
    .replaceAll('ť', 't')
    .replaceAll('ú', 'u')
    .replaceAll('ů', 'u')
    .replaceAll('ý', 'y')
    .replaceAll('ź', 'z')
    .replaceAll('ż', 'z')
    .replaceAll('ž', 'z');

};

export const getHasSpecialCharacters = (text: string) => {
    return text !== normilzeWord(text);
};
