export const removeDiacratics = (word: string) => word
  .replaceAll('ą', 'a')
  .replaceAll('á', 'a')
  .replaceAll('ä', 'a')
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
  .replaceAll('ñ', 'n')
  .replaceAll('ó', 'o')
  .replaceAll('ö', 'o')
  .replaceAll('ř', 'r')
  .replaceAll('ß', 's')
  .replaceAll('ś', 's')
  .replaceAll('š', 's')
  .replaceAll('ť', 't')
  .replaceAll('ú', 'u')
  .replaceAll('ů', 'u')
  .replaceAll('ü', 'u')
  .replaceAll('ý', 'y')
  .replaceAll('ź', 'z')
  .replaceAll('ż', 'z')
  .replaceAll('ž', 'z');

export const getNormalizedKey = (wordRaw: string, language: string): string => {
  const word = removeDiacratics(wordRaw);

  if (word.length === 2) {
    return '2ch';
  }

  if (word.length < 3) {
    return '';
  }

  if (word.length === 3) {
    return '3ch';
  }

  if (language === 'pl') {
    /*
            "Nie" means no/not and in Polish you connect those for a lot of words ex:
            nieżyje - not alive, nieładny - not pretty etc.

            So it gets its own subkey.
        */
    if (word.startsWith('nie')) {
      if (word.length === 4) {
        return 'nie1ch';
      }

      if (word.length === 5) {
        return 'nie2ch';
      }

      return word.slice(0, 6);
    }
  }

  return word.slice(0, 3);
};

export const getIsKeyValid = (key: string = '') => {
  if (key.length === 3) {
    return true;
  }

  if (key.length >= 3 && key.length <= 6 && key.startsWith('nie')) {
    return true;
  }

  return false;
};
