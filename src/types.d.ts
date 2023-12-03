export enum Pane {
    Help = 'Help',
    Game = 'Game',
    Settings = 'Settings',
    Statistics = 'Statistics',
}

export type PaneChange = (Pane) => void;

export enum AffixStatus {
    Unknown = '',
    New = 'new',
    Correct = 'correct',
    Position = 'position',
    Incorrect = 'incorrect',
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

export interface Toast {
    text: string,
    timeoutSeconds: number,
    toastTime: number | null,
}

export interface RootAppState {
    toast: Toast,
    shouldVibrate: boolean,
    shouldKeyboardVibrate: boolean,
    isSmallKeyboard: boolean,
    shouldConfirmEnter: boolean,
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
}

export interface RootState {
    app: RootAppState,
    game: RootGameState,
}

export interface UsedLetters {
    [key: string]: boolean,
}
