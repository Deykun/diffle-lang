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
}

export interface Word {
    word: string,
    affixes: Affix[],
    caretShift?: number,
}

export interface Toast {
    text: string,
    timeoutSeconds: number,
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

export interface RootGameState {
    mode: GameMode,
    today: string,
    wordToGuess: string,
    caretShift: number,
    wordToSubmit: string,
    isWon: boolean,
    letters: {
        correct: UsedLetters,
        incorrect: UsedLetters,
        position: UsedLetters,
    },
    guesses: Word[],
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
