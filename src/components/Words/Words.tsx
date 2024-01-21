import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

import { useSelector } from '@store';
import {
    selectIsGameEnded,
    selectIsProcessing,
    selectWordToSubmit,
    selectWordState,
} from '@store/selectors';

import { Word as WordInterface, AffixStatus } from '@common-types';

import useScrollEffect from '@hooks/useScrollEffect';

import IconDashedCircle from '@components/Icons/IconDashedCircle';

import EndResult from '@components/EndResult/EndResult';

import Word from './Word';
import WordTip from './WordTip';

import './Words.scss';

const Words = () => {
    const guesses = useSelector((state) => state.game.guesses);
    const isGameEnded = useSelector(selectIsGameEnded);
    const hasLongGuesses = useSelector((state) => state.game.hasLongGuesses);
    const isProcessing = useSelector(selectIsProcessing);
    const wordToSubmit = useSelector(selectWordToSubmit);
    const wordStatus = useSelector(selectWordState(wordToSubmit));
    const caretShift =  useSelector((state) => state.game.caretShift);
    const hasSpace = wordToSubmit.includes(' ');
    const isIncorrect = wordStatus === AffixStatus.Incorrect;
    const isTypedTooMuch = wordStatus === AffixStatus.IncorrectOccurance;

    const { t } = useTranslation();

    const submitGuess: WordInterface = useMemo(() => {
        const affixes = (wordToSubmit || ' ').split('').map(letter => ({ type: AffixStatus.New, text: letter }));

        return {
            word: wordToSubmit,
            affixes,
            caretShift,
        };
    }, [wordToSubmit, caretShift]);

    useScrollEffect('bottom', [wordToSubmit]);

    const tiptext = useMemo(() => {
        if (isProcessing) {
            return 'game.checking';
        }

        if (isIncorrect){
            return 'game.youCanUseIncorrectLetters';
        }

        if (isTypedTooMuch){
            return 'game.youCanUseLettersTypedTooManyTimes';
        }

        if (hasSpace) {
            return 'game.youCanUseSpace';
        }

        return '';
    }, [hasSpace, isIncorrect, isProcessing, isTypedTooMuch]);

    const shouldBeNarrower = hasLongGuesses || wordToSubmit.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS;
    const shouldBeShorter = guesses.length > 8;

    return (
        <div className={clsx('words', { 'narrow': shouldBeNarrower, 'shorter': shouldBeShorter })}>
            <WordTip />
            {guesses.map((guess, index) => {            
                return (
                    <Word key={`guess-${index}`} guess={guess} />
                );
            })}
            {isGameEnded ? <EndResult /> : <Word guess={submitGuess} />}
            <p
                className={clsx('status-tip', {
                    'is-processing': isProcessing,
                    'is-incorrect': isIncorrect || isTypedTooMuch,
                    'space': hasSpace,
                })}
            >
                {isProcessing && <IconDashedCircle />}
                {tiptext && <span dangerouslySetInnerHTML={{ __html: t(tiptext) }} />}
            </p>
        </div>
    )
};

export default Words;
