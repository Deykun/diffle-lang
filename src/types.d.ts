export enum ToastType {
  Default = 'default',
  Error = 'error',
  Incorrect = 'incorrect',
}

export enum Pane {
  Help = 'help',
  Game = 'game',
  Settings = 'settings',
  Statistics = 'statistics',
  YearSummary = 'hejto-2024',
  AboutLanguage = 'about-language',
}

export type KeyLinesVariant = {
  name: string,
  keyLines: string[][],
};

export type Dictionary = {
  code?: string,
  languages: string[],
  title: string,
  isBeta?: boolean,
  keyLinesVariants: KeyLinesVariant[],
  keyLinesToUse: string[][],
  allowedKeys: string[],
  characters: string[],
  specialCharacters: string[],
  hasSpecialCharacters: boolean,
  urls: {
    url: string,
    name: string,
    hasExactMatchAlways: boolean, // exact means that there have to be exact match
  }[],
  shareMarker?: string,
  maxWordLength?: number,
};

export enum DictionaryInfoLetters {
  Common = 'common',
  InWords = 'inWords',
  First = 'first',
  Last = 'last',
  InWordsWordle = 'inWordsWordle',
}

type WordleResult = {
  word: string,
  score: number,
  result: {
    total: number,
    green: number,
    orange: number,
    gray: number,
  }
};

export type DictionaryInfo = {
  spellchecker: {
    accepted: {
      all: number,
      allWordleWords: number,
      withSpecialCharacters: number,
      withoutSpecialCharacters: number,
      length: {
        [lengt: string]: number,
      }
    }
    letters: {
      [DictionaryInfoLetters.First]: {
        [letter: string]: number,
      },
      [DictionaryInfoLetters.Last]: {
        [letter: string]: number,
      },
      [DictionaryInfoLetters.Common]: {
        [letter: string]: number,
      },
      [DictionaryInfoLetters.InWords]: {
        [letter: string]: number,
      },
      [DictionaryInfoLetters.InWordsWordle]: {
        [letter: string]: number,
      }
      wordle: {
        [position: string]: {
          [letter: string]: number,
        }
      }
    }
    substrings: {
      first: {
        [length: string]: {
          [text: string]: number,
        },
      },
      middle: {
        [length: string]: {
          [text: string]: number,
        },
      },
      last: {
        [length: string]: {
          [text: string]: number,
        },
      },
    },
    wordle: {
      inWords: WordleResult[],
      letterPosition: WordleResult[],
      uniqueLetterPosition: WordleResult[],
      bestMax: WordleResult[],
      bestMaxGreen: WordleResult[],
      bestMaxOrange: WordleResult[],
      bestMaxGray: WordleResult[],
      bestGreen1_5: WordleResult[],
      bestGreen2_0: WordleResult[],
    },
  }
  meta: {
    nativeSpeakersFromWikipedia: number,
    spellchecker: {
      dir: string,
      shortName: string,
      fullName: string,
      url: string,
    }
    spellcheckerAlt?: {
      dir: string,
      shortName: string,
      fullName: string,
      url: string,
    },
    winning: {
      dir: string,
      shortName: string,
      fullName: string,
      url: string,
    }
  }
};

export type PaneChange = (Pane) => void;

export enum AffixStatus {
  Unknown = '',
  New = 'new',
  Correct = 'correct',
  Position = 'position',
  Incorrect = 'incorrect',
  IncorrectOccurance = 'incorrect-occurrence',
  IncorrectOccuranceMissing = 'incorrect-occurrence-missing',
  IncorrectStart = 'incorrect-start',
  IncorrectEnd = 'incorrect-end',
  IncorrectMiddle = 'incorrect-middle',
  IncorrectOrder = 'incorrect-order',
}

export type Affix = {
  type: AffixStatus,
  subtype?: 'typed-incorrect',
  text: string,
  wordIndex?: number,
  isStart?: boolean,
  isEnd?: boolean,
  isSubmitted?: boolean,
  hasCaretBefore?: boolean,
  onClick?: () => void,
};

export type Word = {
  word: string,
  affixes: Affix[],
  caretShift?: number,
};

export enum LetterReportStatus {
  Ignored = 'ignored',
  Correct = 'correct',
  NotEnoughLetters = 'not-enough-letters',
  TooManyLetters = 'too-many-letters',
}

export type LetterSubreport = {
  status: LetterReportStatus,
  isLimitKnown?: boolean,
  typedOccurrence?: number,
  confirmedOccurrence?: number,
};

export type Toast = {
  text: string,
  type: ToastType,
  timeoutSeconds: number,
  toastTime: number | null,
  params: {
    [key: string]: string | number,
  },
};

export enum CookiesName {
  GOOGLE_ANALYTICS = 'googleAnalytics',
  DIFFLE_EXTERNAL = 'diffleExternal',
  DIFFLE_LOCAL = 'diffleLocal',
}

export type CookiesSettingsInterfence = {
  [CookiesName.GOOGLE_ANALYTICS]: boolean,
  [CookiesName.DIFFLE_EXTERNAL]: boolean,
  [CookiesName.DIFFLE_LOCAL]: boolean,
};

export type RootAppState = {
  pane: {
    active: Pane,
    params: {
      [key: string]: string | number,
    },
  },
  cookies: CookiesSettingsInterfence,
  toast: Toast,
  shouldVibrate: boolean,
  shouldKeyboardVibrate: boolean,
  isSmallKeyboard: boolean,
  keyboardLayoutIndex: number,
  isEnterSwapped: boolean,
  shouldConfirmEnter: boolean,
  shouldShareWords: boolean,
  shouldShowDuration: boolean,
};

export enum GameMode {
  Daily = 'daily',
  Practice = 'practice',
  Share = 'share',
  SandboxLive = 'sandbox_live',
}

export enum GameStatus {
  Unset = 'unset',
  Guessing = 'guessing',
  Won = 'won',
  Lost = 'lost',
}

export type EasterDays = {
  [date: string]: {
    type: string,
    specialMode: GameMode,
    emojis?: {
      correct: string[],
      position: string[],
      incorrect: string[],
      typedKnownIncorrect: string[],
    }[],
  }
};

export type CatalogItem = {
  key: string,
  endIndex: number,
  keyWords: number,
};

export type Catalog = {
  words: number,
  items: CatalogItem[],
  winningWordsLengths: {
    [length: string]: number,
  },
  easterEggDays: EasterDays,
  maxPopularityPosition: number,
};

export type FlatAffixes = {
  start: string,
  notStart: string[],
  middle: string[],
  correctOrders: string[][],
  notEnd: string[],
  end: string,
};

export type RootGameState = {
  language: 'cs' | 'de' | 'en' | 'es' | 'fi' | 'fr' | 'it' | 'pl' | undefined,
  mode: GameMode,
  today: string,
  wordToGuess: string,
  caretShift: number,
  wordToSubmit: string,
  status: GameStatus,
  letters: UsedLettersByType,
  guesses: Word[],
  rejectedWords: string[],
  easterEggDays: EasterDays,
  hasLongGuesses: boolean,
  isProcessing: boolean,
  isLoadingGame: boolean,
  isErrorLoading: boolean,
  lastUpdateTime: number,
  durationMS: number,
  lastWordAddedToStatitstic: string,
  flatAffixes: FlatAffixes,
};

export type RootState = {
  app: RootAppState,
  game: RootGameState,
};

export type UsedLetters = {
  [key: string]: number,
};

export type UsedLettersByType = {
  correct: UsedLetters,
  incorrect: UsedLetters,
  position: UsedLetters,
};

export enum BestWordleType {
  InWords = 'inWords',
  LetterPosition = 'letterPosition',
  UniqueLetterPosition = 'uniqueLetterPosition',
  BestMax = 'bestMax',
  BestMaxGreen = 'bestMaxGreen',
  BestMaxOrange = 'bestMaxOrange',
  BestMaxGray = 'bestMaxGray',
  BestGreen1_5 = 'bestGreen1_5',
  BestGreen2_0 = 'bestGreen2_0',
}

type ResultsInfo = {
  totalWords: {
    [total: string]: number;
  };
  totalLetters: {
    [total: string]: number;
  };
  gamesPlayed: number;
  medianWords: number;
  medianLetters: number;
  best: {
    word: string,
    letters: number,
  };
  worst: {
    word: string,
    letters: number,
  };
};

export type YearSummaryInfo = YearlyInfo & {
  activePlayers: number,
  byUser: {
    [username: string]: {
      best30: ResultsInfo,
      results: {
        year: ResultsInfo,
        [month: string]: ResultsInfo,
      },
      dates: {
        year: string[],
        [month: string]: string[],
      },
    },
  },
  rankByWords: {
    [word: string]: ResultsInfo,
  },
};
