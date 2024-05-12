
export const getAllLineWords = (dictionary, lineLocation = 'first') => {
  const lines = dictionary.split(/\r?\n/);

  let rawWords = [];

  if (lineLocation === 'first') {
    rawWords = lines.flatMap((line) => line.trim().replace(/\s+/g,' ').split(' ')[0])
  }

  if (lineLocation === 'all') {
    rawWords = lines.flatMap((line) => line.trim().replace(/\s+/g,' ').split(' '));
  }

  const processedWords = rawWords.filter(Boolean).map(word => word.toLowerCase());

  return [...new Set(processedWords)];
}

export const removeDiacratics = (word, lang) => {
  let wordToReturn = word;

  // If lang not passed or specified
  if (!lang || lang === 'cs') {
      wordToReturn = wordToReturn
          .replaceAll('á', 'a')
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
}

// TODO: Should work better now Polish special character are aceppted in English.
export const getIsWordValid = (word, lang) => removeDiacratics(word, lang).replace(/[^a-z]/g, '').length === word.length;

export const getWordsFromDictionary = (dictionary, {
  pattern,
  lang,
}) => {
  const supportedPatterns = ['word', 'ignore word', 'word ignore', 'word/ignore'];

  if (!supportedPatterns.includes(pattern)) {
      throw 'An unknown pattern';
  }

  const uniqueLines = [... new Set(dictionary.split(/\r?\n/).filter(Boolean).map((line) => line.toLowerCase().replace(/\s+/g,' ').trim()))];

  let words = [];
  if (pattern === 'word') {
      words = uniqueLines;
  }

  if (pattern === 'ignore word') {
      words = uniqueLines.map(line => line.split(' ').at(-1)).filter(Boolean)
  }

  if (pattern === 'word ignore') {
    words = uniqueLines.map(line => line.split(' ')[0]).filter(Boolean)
  }

  if (pattern === 'word/ignore') {
    words = uniqueLines.map(line => line.split('/')[0]).filter(Boolean)
  }

  const uniqueWords = [...new Set(words)];

  const validWords = uniqueWords.filter(word => getIsWordValid(word, lang));

  return validWords;
}