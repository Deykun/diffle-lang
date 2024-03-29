import { useEffect } from 'react';

import { GameMode } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { getIsFirstStampInFuture } from '@utils/date';

import { useDispatch, useSelector } from '@store';
import { saveEndedGame } from '@store/gameSlice';
import {
  selectWordToGuess,
} from '@store/selectors';

import {
  getLocalStorageKeyForGame,
  getLocalStorageKeyForDailyStamp,
  getLocalStorageKeyForLastGameMode,
} from '@utils/game';

import useEffectChange from '@hooks/useEffectChange';

function useSaveProgressLocally() {
  const dispatch = useDispatch();
  const gameLanguage = useSelector(state => state.game.language);
  const gameStatus = useSelector(state => state.game.status);
  const gameMode = useSelector(state => state.game.mode);
  const todayStamp = useSelector(state => state.game.today);
  const lastUpdateTime = useSelector(state => state.game.lastUpdateTime);
  const durationMS = useSelector(state => state.game.durationMS);
  const wordToGuess = useSelector(selectWordToGuess);
  const rejectedWords = useSelector(state => state.game.rejectedWords);
  const guesses = useSelector(state => state.game.guesses);

  useEffect(() => {
    dispatch(saveEndedGame());
  }, [dispatch, gameLanguage, gameStatus]);

  useEffect(() => {
    if (gameLanguage && wordToGuess) {
      const localStorageKeyForLastGameMode = getLocalStorageKeyForLastGameMode({ gameLanguage });
      localStorage.setItem(localStorageKeyForLastGameMode, gameMode);

      if (gameMode === GameMode.Daily) {
        const localStorageKeyForDailyStamp = getLocalStorageKeyForDailyStamp({ gameLanguage });
        localStorage.setItem(localStorageKeyForDailyStamp, todayStamp);

        const maxDailyStamp = localStorage.getItem(LOCAL_STORAGE.MAX_DAILY_STAMP) || '' as string;
        if (!maxDailyStamp) {
          localStorage.setItem(LOCAL_STORAGE.MAX_DAILY_STAMP, todayStamp);
        } else {
          const isNewerStamp = getIsFirstStampInFuture(maxDailyStamp, todayStamp);

          if (isNewerStamp) {
            localStorage.setItem(LOCAL_STORAGE.MAX_DAILY_STAMP, todayStamp);
          }
        }
      }
    }
  }, [gameLanguage, gameMode, todayStamp, wordToGuess]);

  useEffectChange(() => {
    if (gameLanguage && wordToGuess) {
      const guessesWords = guesses.map(({ word }) => word);

      const recoveryState = {
        status: gameStatus,
        wordToGuess,
        guessesWords,
        rejectedWords,
        lastUpdateTime,
        durationMS,
      };

      const localStorageKeyForLastGameMode = getLocalStorageKeyForGame({ gameLanguage, gameMode });

      localStorage.setItem(localStorageKeyForLastGameMode, JSON.stringify(recoveryState));
    }
  }, [gameLanguage, wordToGuess, gameStatus, guesses, rejectedWords, durationMS]);
}

export default useSaveProgressLocally;
