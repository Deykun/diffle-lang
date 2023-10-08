import clsx from 'clsx';
import { useMemo } from 'react';

import { WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

import { useSelector } from '@store';
import { selectIsProcessing, selectHasWordToGuessSpecialCharacters, selectWordToSubmit } from '@store/selectors';

import { Word as WordInterface, AffixStatus } from '@common-types';

import useScrollEffect from '@hooks/useScrollEffect';

import IconDashedCircle from '@components/Icons/IconDashedCircle';

import Win from '@components/Win/Win';

import Word from './Word';

import './Words.scss';

const Words = () => {
    const guesses = useSelector((state) => state.game.guesses);
    const isWon = useSelector((state) => state.game.isWon);
    const hasLongGuesses = useSelector((state) => state.game.hasLongGuesses);
    const isProcessing = useSelector(selectIsProcessing);
    const wordToSubmit = useSelector(selectWordToSubmit);
    const hasSpecialCharacters = useSelector(selectHasWordToGuessSpecialCharacters);
    const hasSpace = wordToSubmit.includes(' ');

    const submitGuess: WordInterface = useMemo(() => {
        const affixes = (wordToSubmit || ' ').split('').map(letter => ({ type: AffixStatus.New, text: letter }));

        return {
        word: wordToSubmit,
        affixes,
        };
    }, [wordToSubmit]);

    useScrollEffect('bottom', [wordToSubmit])

    const shouldBeNarrower = hasLongGuesses || wordToSubmit.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS;
    const shouldBeShorter = guesses.length > 8;

    return (
        <div className={clsx('words', { 'narrow': shouldBeNarrower, 'shorter': shouldBeShorter })}>
            <p className={clsx('word-tip', { 'has-polish': hasSpecialCharacters })}>
                {
                    hasSpecialCharacters ?
                    <>Hasło <strong>zawiera</strong> chociaż jeden polski znak.</> : 
                    <>Hasło <strong>nie zawiera</strong> polskich znaków.</>
                }
            </p>
            {guesses.map((guess, index) => {            
                return (
                    <Word key={`guess-${index}`} guess={guess} />
                );
            })}
            {isWon ? <Win /> : <Word guess={submitGuess} />}
            <p
            className={clsx('status', {
                'processing': isProcessing,
                'space': hasSpace,
            })}
            >
                {isProcessing && (<><IconDashedCircle /> <span>sprawdzanie...</span></>)}
                {!isProcessing && hasSpace && <span>Hasła nie mają spacji, ale możesz jej używać (zostanie usunięta).</span>}
            </p>
        </div>
    )
};

export default Words;
