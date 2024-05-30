import clsx from 'clsx';
import { Suspense, lazy, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Word as WordType, AffixStatus, GameMode } from '@common-types';

import { WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

import { useSelector } from '@store';
import {
  selectIsGameEnded,
  selectIsProcessing,
  selectWordToSubmit,
  selectKeyboardState,
  selectWordState,
} from '@store/selectors';

import useScrollEffect from '@hooks/useScrollEffect';

import IconDashedCircle from '@components/Icons/IconDashedCircle';

import EndResult from '@components/EndResult/EndResult';

import Word from './Word';
import WordTip from './WordTip';

import './Words.scss';

const WordSandboxLive = lazy(() => import('./WordSandboxLive'));

const Words = () => {
  const guesses = useSelector(state => state.game.guesses);
  const gameMode = useSelector(state => state.game.mode);
  const isGameEnded = useSelector(selectIsGameEnded);
  const hasLongGuesses = useSelector(state => state.game.hasLongGuesses);
  const isProcessing = useSelector(selectIsProcessing);
  const wordToSubmit = useSelector(selectWordToSubmit);
  const wordStatus = useSelector(selectWordState(wordToSubmit));
  const { status: keyboardStatus, details } = useSelector(selectKeyboardState);
  const caretShift = useSelector(state => state.game.caretShift);
  const hasSpace = wordToSubmit.includes(' ');
  const isIncorrectType = [
    AffixStatus.Incorrect,
    AffixStatus.IncorrectOccurance,
  ].includes(wordStatus) || [
    AffixStatus.IncorrectStart,
    AffixStatus.IncorrectMiddle,
    AffixStatus.IncorrectOrder,
    AffixStatus.IncorrectEnd,
  ].includes(keyboardStatus);

  console.log({
    keyboardStatus, details,
  })

  const { t } = useTranslation();

  const submitGuess: WordType = useMemo(() => {
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

    if (wordStatus === AffixStatus.Incorrect) {
      return 'game.youCanUseIncorrectLetters';
    }

    if (wordStatus === AffixStatus.IncorrectOccurance) {
      return 'game.youCanUseLettersTypedTooManyTimes';
    }

    if (keyboardStatus === AffixStatus.IncorrectStart) {
      return 'game.youCanUseIncorrectStart';
    }

    if (keyboardStatus === AffixStatus.IncorrectMiddle) {
      return 'game.youCanUseIncorrectMiddle';
    }

    if (keyboardStatus === AffixStatus.IncorrectOrder) {
      return 'game.youCanUseIncorrectOrder';
    }

    if (keyboardStatus === AffixStatus.IncorrectEnd) {
      return 'game.youCanUseIncorrectEnd';
    }

    if (hasSpace) {
      return 'game.youCanUseSpace';
    }

    return '';
  }, [hasSpace, isProcessing, keyboardStatus, wordStatus]);

  const shouldBeNarrower = hasLongGuesses || wordToSubmit.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS;
  const shouldBeShorter = guesses.length > 8;

  return (
      <div className={clsx('words', { narrow: shouldBeNarrower, shorter: shouldBeShorter })}>
          <WordTip />
          {guesses.map((guess) => {
            return (
                <Word key={`guess-${guess.word}`} guess={guess} isSubmitted />
            );
          })}
          {isGameEnded ? <EndResult /> : <Word guess={submitGuess} />}
          {!isGameEnded && gameMode === GameMode.SandboxLive && (
          <Suspense>
              <WordSandboxLive />
          </Suspense>
          )}
          <p
            className={clsx('status-tip', {
              'is-processing': isProcessing,
              'is-incorrect': isIncorrectType,
              space: hasSpace,
            })}
          >
              {isProcessing && <IconDashedCircle />}
              {tiptext && (
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: t(tiptext),
                }}
              />
              )}
          </p>
      </div>
  );
};

export default Words;
