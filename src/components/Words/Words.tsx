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
            <WordTip />
            {guesses.map((guess, index) => {            
                return (
                    <Word key={`guess-${index}`} guess={guess} />
                );
            })}
            {isGameEnded ? <EndResult /> : <Word guess={submitGuess} />}
            <p
                className={clsx('status-tip', {
                    'isProcessing': isProcessing,
                    'isIncorrect': isIncorrect,
                    'space': hasSpace,
                })}
            >
                {isProcessing && <><IconDashedCircle /> <span>{t('game.checking')}</span></>}
                {!isProcessing && isIncorrect && <span dangerouslySetInnerHTML={{ __html: t('game.youCanUseIncorrectLetters') }} />}
                {!isProcessing && !isIncorrect && hasSpace && <span dangerouslySetInnerHTML={{ __html: t('game.youCanUseSpace') }} />}
            </p>
        </div>
    )
};

export default Words;
