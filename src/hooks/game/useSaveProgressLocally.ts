import { LOCAL_STORAGE } from '@const';

import { useSelector } from '@store';

import useEffectChange from "@hooks/useEffectChange";


function useSaveProgressLocally() {
    // const type = useSelector(state => state.game.type);
    const wordToGuess = useSelector(state => state.game.wordToGuess);
    const guesses = useSelector(state => state.game.guesses);

    useEffectChange(() => {
        const guessesWords = guesses.map(({ word }) => word);

        const recoveryState = {
            wordToGuess,
            guessesWords,
        };

        localStorage.setItem(LOCAL_STORAGE.TYPE_PRACTICE, JSON.stringify(recoveryState));
    }, [wordToGuess, guesses]);
}

export default useSaveProgressLocally;
