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

import EndResultSummary from './EndResultSummary';

import './EndResult.scss';

const EndResult = () => {
    const dispatch = useDispatch();
    const endStatus = useSelector((state) => state.game.status);
    const gameMode = useSelector((state) => state.game.mode);
    const wordToGuess = useSelector((state) => state.game.wordToGuess);
    const guesses = useSelector((state) => state.game.guesses);
    const { words, letters, subtotals } = useSelector(selectGuessesStatsForLetters);
    const [isReseting, setIsReseting] = useState(false);

    const { t } = useTranslation();

    const { vibrate } = useVibrate();

    useEffect(() => {
        vibrate({ duration: 100 });
    }, [vibrate]);

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

    const handleNewGame = useCallback(() => {
        if (!isReseting) {
            setIsReseting(true);
            getWordToGuess({ gameMode }).then(word => {
                return dispatch(setWordToGuess(word));  
            }).finally(() => {
                setIsReseting(false);
            });
        }
    }, [dispatch, gameMode, isReseting]);

    if (guesses.length === 0) {
        return null;
    }

    const hoursToNext = 24 - getNow().nowUTC.getHours();

    return (
        <>
            <EndResultSummary
                status={endStatus}
                wordToGuess={wordToGuess}
                guesses={guesses}
                words={words}
                letters={letters}
                subtotals={subtotals}
            />
            <div className="end-result-actions">
                {gameMode === GameMode.Practice && (
                    <Button
                        onClick={handleNewGame}
                        isLoading={isReseting}
                    >
                        <IconGamepad />
                        <span>{t('common.newGame')}</span>
                    </Button>
                )}
                <ShareButton shouldShowSettings />
            </div>
            <Button
                tagName="a"
                href={`https://sjp.pl/${wordToGuess}`}
                target="blank"
                rel="noopener noreferrer"
                isInverted
            >
                <IconBook />
                <span>{t('common.checkInDictionary', { word: wordToGuess })}</span>
            </Button>
            {gameMode === GameMode.Daily && (
                <p
                    className="next-word-tip"
                    dangerouslySetInnerHTML={{ __html: t('end.nextDaily', {
                        postProcess: 'interval',
                        count: hoursToNext,
                    })}}
                />
            )}
        </>
    )
};

export default EndResult;