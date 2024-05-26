import { FlatAffixes } from '@common-types';

export const removeDiacratics = (word: string, lang?: string) => {
  let wordToReturn = word;

  // If lang not passed or specified
  if (!lang || lang === 'cs') {
    wordToReturn = wordToReturn.replaceAll('á', 'a')
      .replaceAll('č', 'c')
      .replaceAll('ď', 'd')
      .replaceAll('é', 'e')
      .replaceAll('ě', 'e')
      .replaceAll('í', 'i')
      .replaceAll('ň', 'n')
      .replaceAll('ó', 'o')
      .replaceAll('ř', 'r')
      .replaceAll('š', 's')
      .replaceAll('ť', 't')
      .replaceAll('ú', 'u')
      .replaceAll('ů', 'u')
      .replaceAll('ý', 'y')
      .replaceAll('ž', 'z');
  }

  if (!lang || lang === 'de') {
    wordToReturn = wordToReturn
      .replaceAll('ä', 'a')
      .replaceAll('ö', 'o')
      .replaceAll('ß', 's')
      .replaceAll('ü', 'u');
  }

  if (!lang || lang === 'de') {
    wordToReturn = wordToReturn
      .replaceAll('ä', 'a')
      .replaceAll('ö', 'o')
      .replaceAll('ß', 's')
      .replaceAll('ü', 'u');
  }

  if (!lang || lang === 'es') {
    wordToReturn = wordToReturn
      .replaceAll('á', 'a')
      .replaceAll('é', 'e')
      .replaceAll('í', 'i')
      .replaceAll('ó', 'o')
      .replaceAll('ú', 'u')
      .replaceAll('ü', 'ü')
      .replaceAll('ñ', 'n');
  }

  if (!lang || lang === 'fr') {
    wordToReturn = wordToReturn
      .replaceAll('à', 'a')
      .replaceAll('â', 'a')
      .replaceAll('æ', 'a')
      .replaceAll('ç', 'c')
      .replaceAll('é', 'e')
      .replaceAll('è', 'e')
      .replaceAll('ê', 'e')
      .replaceAll('ë', 'e')
      .replaceAll('î', 'i')
      .replaceAll('ï', 'i')
      .replaceAll('ô', 'o')
      .replaceAll('œ', 'o')
      .replaceAll('ù', 'u')
      .replaceAll('û', 'u')
      .replaceAll('ü', 'u');
  }

  if (!lang || lang === 'it') {
    wordToReturn = wordToReturn
      .replaceAll('à', 'a')
      .replaceAll('è', 'e')
      .replaceAll('é', 'e')
      .replaceAll('ì', 'i')
      .replaceAll('í', 'i')
      .replaceAll('î', 'i')
      .replaceAll('ò', 'o')
      .replaceAll('ó', 'o')
      .replaceAll('ù', 'u')
      .replaceAll('ú', 'u');
  }

  if (!lang || lang === 'pl') {
    wordToReturn = wordToReturn
      .replaceAll('ą', 'a')
      .replaceAll('ć', 'c')
      .replaceAll('ę', 'e')
      .replaceAll('ł', 'l')
      .replaceAll('ń', 'n')
      .replaceAll('ó', 'o')
      .replaceAll('ś', 's')
      .replaceAll('ź', 'z')
      .replaceAll('ż', 'z');
  }

  return wordToReturn;
};

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

export const mergeFlatAffixes = (flatAffixesA: FlatAffixes, flatAffixesB: FlatAffixes) => {
  const flatAffixesResult: FlatAffixes = {
    ...flatAffixesA,
    middle: [...flatAffixesA.middle],
  };

  if (flatAffixesResult.start.length < flatAffixesB.start.length) {
    flatAffixesResult.start = flatAffixesB?.start || '';
  }

  flatAffixesResult.notStart = [...new Set([...flatAffixesResult.notStart, ...flatAffixesB.notStart])];

  if (flatAffixesResult.end.length < flatAffixesB.end.length) {
    flatAffixesResult.end = flatAffixesB?.end || '';
  }

  flatAffixesResult.notEnd = [...new Set([...flatAffixesResult.notEnd, ...flatAffixesB.notEnd])];

  flatAffixesB.middle.forEach((flatAffix) => {
    const hasMatchInState = flatAffixesResult.middle.some(stateAffix => stateAffix.startsWith(flatAffix)
      || stateAffix.endsWith(flatAffix));

    if (!hasMatchInState) {
      const indexToExtend = flatAffixesResult.middle.findIndex(stateAffix => flatAffix.startsWith(stateAffix)
        || flatAffix.endsWith(stateAffix));

      if (indexToExtend >= 0) {
        flatAffixesResult.middle[indexToExtend] = flatAffix;
      } else {
        flatAffixesResult.middle.push(flatAffix);
      }
    }
  });

  console.log(flatAffixesResult);

  return flatAffixesResult;
};
