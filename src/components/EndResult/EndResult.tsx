import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode } from '@common-types';

import { getNow } from '@utils/date';

import { useSelector, useDispatch } from '@store';
import { setGameMode, setWordToGuess } from '@store/gameSlice';
import {
  selectIsTodayEasterDay,
  selectGuessesStatsForLetters,
} from '@store/selectors';

import getWordToGuess from '@api/getWordToGuess';

import useVibrate from '@hooks/useVibrate';
import usePanes from '@hooks/usePanes';

import IconEgg from '@components/Icons/IconEgg';
import IconGamepad from '@components/Icons/IconGamepad';

import Button from '@components/Button/Button';
import GoToDictionaryButton from '@components/Dictionary/GoToDictionaryButton';
import ShareButton from '@components/Share/ShareButton';
import StatisticsHint from '@components/Panes/Statistics/StatisticsHint';

import EndResultSummary from './EndResultSummary';

import './EndResult.scss';

function EndResult() {
  const dispatch = useDispatch();
  const endStatus = useSelector(state => state.game.status);
  const gameLanguage = useSelector(state => state.game.language);
  const isTodayEasterDay = useSelector(selectIsTodayEasterDay);
  const gameMode = useSelector(state => state.game.mode);
  const wordToGuess = useSelector(state => state.game.wordToGuess);
  const guesses = useSelector(state => state.game.guesses);
  const { words, letters, subtotals } = useSelector(selectGuessesStatsForLetters);
  const [isReseting, setIsReseting] = useState(false);

  const { t } = useTranslation();

  const { vibrate } = useVibrate();
  const { changePane } = usePanes();

  useEffect(() => {
    vibrate({ duration: 100 });
  }, [vibrate]);

  const handleNewGame = useCallback(() => {
    if (!isReseting && gameLanguage) {
      setIsReseting(true);
      getWordToGuess({ gameMode, gameLanguage }).then((word) => {
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
              {gameMode !== GameMode.Daily && (
              <Button
                onClick={handleNewGame}
                isLoading={isReseting}
              >
                  <IconGamepad />
                  <span>{t('common.newGame')}</span>
              </Button>
              )}
              {gameMode === GameMode.Daily && isTodayEasterDay && (
              <Button
                onClick={() => setGameMode(GameMode.SandboxLive)}
                isLoading={isReseting}
              >
                  <IconEgg />
              </Button>
              )}
              <ShareButton shouldShowSettings />
          </div>
          <GoToDictionaryButton word={wordToGuess} />
          {gameMode === GameMode.Daily && (
          <p
            className="next-word-tip"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t('end.nextDaily', {
                postProcess: 'interval',
                count: hoursToNext,
              }),
            }}
          />
          )}
          <StatisticsHint />
      </>
  );
}

export default EndResult;
