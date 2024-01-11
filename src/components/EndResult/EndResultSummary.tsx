import clsx from 'clsx';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Word as WordInterface, AffixStatus, GameMode, GameStatus } from '@common-types';

import { getNow } from '@utils/date';

import { useSelector, useDispatch } from '@store';
import { selectGuessesStatsForLetters } from '@store/selectors';
import { setWordToGuess } from '@store/gameSlice'

import getWordToGuess from '@api/getWordToGuess'

import useVibrate from '@hooks/useVibrate';

import IconBook from '@components/Icons/IconBook';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconFancyThumbDown from '@components/Icons/IconFancyThumbDown';
import IconGamepad from '@components/Icons/IconGamepad';
import IconMagic from '@components/Icons/IconMagic';

import Word from '@components/Words/Word';
import Button from '@components/Button/Button';
import ShareButton from '@components/Share/ShareButton';

import './EndResult.scss';

const EndResultSummary = ({
    status,
    wordToGuess,
    guesses,
    words,
    letters,
    subtotals,
}) => {
    const { t } = useTranslation();

    const lostWord: WordInterface = useMemo(() => {
        const affixes = [{
            type: AffixStatus.Incorrect,
            text: wordToGuess,
            isStart: true,
            isEnd: true,
        }];

        return {
            word: wordToGuess,
            affixes,
        };
    }, [wordToGuess]);

    if (guesses.length === 0) {
        return null;
    }

    return (
        <div className={clsx('end-result', status)}>
            <h3 className="title">
                {status === GameStatus.Lost && (<>
                    <span>{t('end.titleLost')}</span>
                    <IconFancyThumbDown className="title-icon" />
                </>)}
                {status === GameStatus.Won && (<>
                    {guesses.length > 1 ? (<>
                        <span>{t('end.titleWon')}</span>
                        <IconFancyCheck className="title-icon" />
                    </>): (<>
                        <span>{t('end.titleCheater')}</span>
                        <IconMagic className={clsx('title-icon', 'title-icon--magic')} />
                    </>)}
                </>)}
            </h3>
            <div className="totals">
                <div className="total">
                    {status === GameStatus.Lost && (<>
                        {t('end.winningWord')}
                        <div className="lost-word-wrapper">
                            <Word guess={lostWord} />
                        </div>
                    </>)}
                    {status === GameStatus.Won && (<>
                        <strong>{letters}</strong>
                        {' '}
                        {t('end.lettersUsed', { postProcess: 'interval', count: letters })}
                        {' '}
                        {t('end.in')}
                        {' '}
                        <strong>{words}</strong>
                        {' '}
                        {t('end.inWordsUsed', { postProcess: 'interval', count: words })}
                    </>)}
                </div>
            </div>
            <div className="subtotals">
                <p className="subtotal correct has-tooltip has-tooltip-from-left">
                    <span>{subtotals.correct}</span>
                    <span className="tooltip">{t('statistics.lettersCorrect')}</span>
                </p>
                <p className="subtotal position has-tooltip">
                    <span>{subtotals.position}</span>
                    <span className="tooltip">{t('statistics.lettersPosition')}</span>
                </p>
                <p className="subtotal incorrect has-tooltip">
                    <span>{subtotals.incorrect}</span>
                    <span className="tooltip">{t('statistics.lettersIncorrect')}</span>
                </p>
                <p className="subtotal incorrect typed has-tooltip has-tooltip-from-right">
                    <span>{subtotals.typedKnownIncorrect}</span>
                    <span className="tooltip">{t('statistics.lettersIncorrectAndTyped')}</span>
                </p>
            </div>
        </div>
    )
};

export default EndResultSummary;
