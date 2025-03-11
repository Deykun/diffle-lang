import clsx from 'clsx';
import { Suspense, lazy, useMemo } from 'react';

import { Word as WordType, AffixStatus, GameMode } from '@common-types';

import { WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

import { useSelector } from '@store';
import {
  selectIsGameEnded,
  selectWordToSubmit,
} from '@store/selectors';

import useScrollEffect from '@hooks/useScrollEffect';

import EndResult from '@components/EndResult/EndResult';

import NextDailyTip from '@features/timeToNextDay/components/NextDailyTip';

import Word from './Word';
import WordToGuessTip from './WordToGuessTip';
import WordToSubmitTip from './WordToSubmitTip';

import './Words.scss';

const WordSandboxLive = lazy(() => import('./WordSandboxLive'));

const Words = () => {
  const guesses = useSelector(state => state.game.guesses);
  const gameMode = useSelector(state => state.game.mode);
  const isGameEnded = useSelector(selectIsGameEnded);
  const hasLongGuesses = useSelector(state => state.game.hasLongGuesses);
  const wordToSubmit = useSelector(selectWordToSubmit);
  const caretShift = useSelector(state => state.game.caretShift);

  const submitGuess: WordType = useMemo(() => {
    const affixes = (wordToSubmit || ' ')
      .split('')
      .map(letter => ({ type: AffixStatus.New, text: letter }));

    return {
      word: wordToSubmit,
      affixes,
      caretShift,
    };
  }, [wordToSubmit, caretShift]);

  useScrollEffect('bottom', [wordToSubmit]);

  const shouldBeNarrower = hasLongGuesses
    || wordToSubmit.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS;
  const shouldBeShorter = guesses.length > 8;

  return (
      <div
        className={clsx('words', {
          'words--is-ended': isGameEnded,
          narrow: shouldBeNarrower,
          shorter: shouldBeShorter,
        })}
      >
          <NextDailyTip />
          <WordToGuessTip />
          {guesses.map((guess) => {
            return <Word key={`guess-${guess.word}`} guess={guess} isSubmitted />;
          })}
          {isGameEnded ? <EndResult /> : <Word guess={submitGuess} />}
          {!isGameEnded && gameMode === GameMode.SandboxLive && (
          <Suspense>
              <WordSandboxLive />
          </Suspense>
          )}
          <WordToSubmitTip />
      </div>
  );
};

export default Words;
