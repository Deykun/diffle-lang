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
    AboutLanguage = 'about-language',
}

export interface Dictionary {
    code?: string,
    languages: string[],
    title: string,
    shouldPreferQWERTZ: boolean,
    keyLines: string[][],
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
}

export enum DictionaryInfoLetters {
    Common = 'common',
    InWords = 'inWords',
    First = 'first',
    Last = 'last',
} 

export type DictionaryInfo = {
    spellchecker: {
        accepted: {
            all: number,
            withSpecialCharacters: number,
            withoutSpecialCharacters: number,
            length: {
                [lengt: string]: number,
            }
        }
        letters: {
            [DictionaryInfoLetters.First]: {
                [letter: string]: number,
            }
            [DictionaryInfoLetters.Last]: {
                [letter: string]: number,
            }
            [DictionaryInfoLetters.Common]: {
                [letter: string]: number,
            }
            [DictionaryInfoLetters.InWords]: {
                [letter: string]: number,
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
    }
    meta: {
        nativeSpeakersFromWikipedia: number,
        spellchecker: {
            dir: string,
            shortName: string,
            fullName: string,
            url: string,
        }
        winning: {
            dir: string,
            shortName: string,
            fullName: string,
            url: string,
        }
    }
}

export type PaneChange = (Pane) => void;

export enum AffixStatus {
    Unknown = '',
    New = 'new',
    Correct = 'correct',
    Position = 'position',
    Incorrect = 'incorrect',
    IncorrectOccurance = 'incorrect-occurrence',
}

export interface Affix {
    type: AffixStatus,
    text: string,
    isStart?: boolean,
    isEnd?: boolean,
    hasCaretBefore?: boolean,
    onClick?: () => void,
}

export interface Word {
    word: string,
    affixes: Affix[],
    caretShift?: number,
}

export enum LetterReportStatus {
    Ignored = 'ignored',
    Correct = 'correct',
    NotEnoughLetters = 'not-enough-letters',
    TooManyLetters = 'too-many-letters',
}

export interface LetterSubreport {
    status: LetterReportStatus,
    isLimitKnown?: boolean,
    typedOccurrence?: number,
    confirmedOccurrence?: number,
}

export interface Toast {
    text: string,
    type: ToastType,
    timeoutSeconds: number,
    toastTime: number | null,
    params: {
        [key: string]: string | number,
    },
}

export enum KeyboardQWERTYMode {
    FROM_LANG = 'language',
    QWERTY = 'qwerty',
    QWERTZ = 'qwertz',
}

export interface RootAppState {
    pane: {
        active: Pane,
        params: {
            [key: string]: string | number,
        },
    },
    toast: Toast,
    shouldVibrate: boolean,
    shouldKeyboardVibrate: boolean,
    isSmallKeyboard: boolean,
    keyboardQWERTYMode: KeyboardQWERTYMode,
    isEnterSwapped: boolean,
    shouldConfirmEnter: boolean,
    shouldShareWords: boolean,
}

export enum GameMode {
    Daily = 'daily',
    Practice = 'practice',
    Share = 'share',
}

export enum GameStatus {
    Unset = 'unset',
    Guessing = 'guessing',
    Won = 'won',
    Lost = 'lost',
}

export interface RootGameState {
    language: 'cs' | 'de' | 'en' | 'pl' | undefined,
    mode: GameMode,
    today: string,
    wordToGuess: string,
    caretShift: number,
    wordToSubmit: string,
    status: GameStatus,
    letters: {
        correct: UsedLetters,
        incorrect: UsedLetters,
        position: UsedLetters,
    },
    guesses: Word[],
    rejectedWords: string[],
    hasLongGuesses: boolean,
    isProcessing: boolean,
    isLoadingGame: boolean,
    isErrorLoading: boolean,
    lastUpdateTime: number,
    durationMS: number,
    lastWordAddedToStatitstic: string,
}

export interface RootState {
    app: RootAppState,
    game: RootGameState,
}

export interface UsedLetters {
    [key: string]: number,
}

