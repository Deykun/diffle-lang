// hello -> 2
// https://stackoverflow.com/a/72347965/6743808 - claims is the fastest
export const getLetterOccuranceInWord = (letter: string, word: string) => word.length - word.replaceAll(letter, '').length;