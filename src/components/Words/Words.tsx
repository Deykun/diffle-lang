import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

import { useSelector } from '@store';
import { selectIsGameEnded, selectIsProcessing, selectHasWordToGuessSpecialCharacters, selectWordToSubmit } from '@store/selectors';

import { Word as WordInterface, AffixStatus } from '@common-types';

import useScrollEffect from '@hooks/useScrollEffect';

import IconDashedCircle from '@components/Icons/IconDashedCircle';

import EndResult from '@components/EndResult/EndResult';

import Word from './Word';

import './Words.scss';

const gameLanguage = 'pl';

const Words = () => {
    const guesses = useSelector((state) => state.game.guesses);
    const isGameEnded = useSelector(selectIsGameEnded);
    const hasLongGuesses = useSelector((state) => state.game.hasLongGuesses);
    const isProcessing = useSelector(selectIsProcessing);
    const wordToSubmit = useSelector(selectWordToSubmit);
    const hasSpecialCharacters = useSelector(selectHasWordToGuessSpecialCharacters);
    const caretShift =  useSelector((state) => state.game.caretShift);
    const hasSpace = wordToSubmit.includes(' ');

    const { t } = useTranslation();

    const submitGuess: WordInterface = useMemo(() => {
        const affixes = (wordToSubmit || ' ').split('').map(letter => ({ type: AffixStatus.New, text: letter }));

        return {
            word: wordToSubmit,
            affixes,
            caretShift,
        };
    }, [wordToSubmit, caretShift]);

    useScrollEffect('bottom', [wordToSubmit])

    const shouldBeNarrower = hasLongGuesses || wordToSubmit.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS;
    const shouldBeShorter = guesses.length > 8;

    return (
        <div className={clsx('words', { 'narrow': shouldBeNarrower, 'shorter': shouldBeShorter })}>
            {/* <p className={clsx('word-tip', { 'has-polish': hasSpecialCharacters })}>

                {
                    hasSpecialCharacters ?
                    <>Hasło <strong>zawiera</strong> chociaż jeden polski znak.</> : 
                    <>Hasło <strong>nie zawiera</strong> polskich znaków.</>
                }
            </p> */}

            {hasSpecialCharacters ?
                <p 
                    className={clsx('word-tip', 'has-polish')}
                    dangerouslySetInnerHTML={{
                    __html: t('game.withSpecialCharacters', { specialCharacter: t(`game.${gameLanguage}SpecialCharacter`) })
                    }}
                />
                :
                <p 
                className="word-tip"
                dangerouslySetInnerHTML={{
                    __html: t('game.withoutSpecialCharacters', { specialCharacters: t(`game.${gameLanguage}SpecialCharacters`) })
                }}
                />
            }

            {guesses.map((guess, index) => {            
                return (
                    <Word key={`guess-${index}`} guess={guess} />
                );
            })}
            {isGameEnded ? <EndResult /> : <Word guess={submitGuess} />}
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
