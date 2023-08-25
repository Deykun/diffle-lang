import { Word } from '@common-types';

interface Params {
    wordToGuess: string,
    guesses: Word[],
}

export const hashUrlParams = ({ wordToGuess = '', guesses = [] }: Params) => {
    if (!wordToGuess) {
        return {
            wordToGuess: '', guesses: '',
        };
    }

    // To prevent giving hint that the password is short
    const normalizedLentgPassword = `${wordToGuess}0123456789012345`.slice(0, 15);

    console.log('guesses', guesses);

    return normalizedLentgPassword;
};
