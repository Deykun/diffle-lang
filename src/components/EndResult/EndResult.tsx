import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode } from '@common-types';

import { getNow } from '@utils/date';

import { useSelector, useDispatch } from '@store';
import { setWordToGuess } from '@store/gameSlice'
import { selectGuessesStatsForLetters } from '@store/selectors';

import getWordToGuess from '@api/getWordToGuess'

import useVibrate from '@hooks/useVibrate';

import IconGamepad from '@components/Icons/IconGamepad';

import Button from '@components/Button/Button';
import GoToDictionaryButton from '@components/Dictionary/GoToDictionaryButton';
import ShareButton from '@components/Share/ShareButton';
import StatisticsHint from '@components/Panes/Statistics/StatisticsHint';

import EndResultSummary from './EndResultSummary';

import './EndResult.scss';

const EndResult = () => {
    const dispatch = useDispatch();
    const endStatus = useSelector((state) => state.game.status);
    const gameLanguage = useSelector((state) => state.game.language);
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

    const handleNewGame = useCallback(() => {
        if (!isReseting && gameLanguage) {
            setIsReseting(true);
            getWordToGuess({ gameMode, gameLanguage }).then(word => {
                return dispatch(setWordToGuess(word));  
            }).finally(() => {
                setIsReseting(false);
            });
        }
    }, [dispatch, gameLanguage, gameMode, isReseting]);

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
            <GoToDictionaryButton word={wordToGuess} />
            {gameMode === GameMode.Daily && (
                <p
                    className="next-word-tip"
                    dangerouslySetInnerHTML={{ __html: t('end.nextDaily', {
                        postProcess: 'interval',
                        count: hoursToNext,
                    })}}
                />
            )}
            <StatisticsHint />
        </>
    )
};

export default EndResult;
