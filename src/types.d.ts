export interface Affix {
    type: ('' | 'new' | 'correct' | 'position' | 'incorrect'),
    text: string,
    isStart?: boolean,
    isEnd?: boolean,
}

export interface Word {
    word: string,
    affixes: Affix[],
}

export interface Toast {
    text: string,
    timeoutSeconds: number,
}

export interface RootGameState {
    wordToGuess: string,
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
    toast: Toast,
}

export export interface RootState {
    game: RootGameState
}

export interface UsedLetters {
    [key: string]: boolean,
}
