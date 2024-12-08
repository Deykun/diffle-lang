export type ParsedHejtoResult = {
  date: string,
  nick: string,
  lang?: string,
  url: string,
  value: string,
  result?: {
    word: string,
    correct: number,
    position: number,
    incorrect: number,
    knownIncorrect: number,
    totalWords: number,
    totalLetters: number,
    date: string,
  },
};
