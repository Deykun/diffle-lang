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
  const { status: keyboardStatus } = useSelector(selectKeyboardState);
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

  const {
    isImpossibleToWin,
    tiptext,
  } = useMemo(() => {
    let text = '';
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let isImpossibleToWin = false;

    if (isProcessing) {
      text = 'game.checking';
    }

    if (wordStatus === AffixStatus.Incorrect) {
      isImpossibleToWin = true;
      text = 'game.youCanUseIncorrectLetters';
    } else if (wordStatus === AffixStatus.IncorrectOccurance) {
      isImpossibleToWin = true;
      text = 'game.youCanUseLettersTypedTooManyTimes';
    } else if (keyboardStatus === AffixStatus.IncorrectStart) {
      isImpossibleToWin = true;
      text = 'game.youCanUseIncorrectStart';
    } else if (keyboardStatus === AffixStatus.IncorrectMiddle) {
      isImpossibleToWin = true;
      text = 'game.youCanUseIncorrectMiddle';
    } else if (keyboardStatus === AffixStatus.IncorrectOrder) {
      isImpossibleToWin = true;
      text = 'game.youCanUseIncorrectOrder';
    } else if (keyboardStatus === AffixStatus.IncorrectEnd) {
      isImpossibleToWin = true;
      text = 'game.youCanUseIncorrectEnd';
    } else if (hasSpace) { 
      text = 'game.youCanUseSpace';
    }

    return {
      isImpossibleToWin,
      tiptext: text,
    };
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
              {!isProcessing && isImpossibleToWin && (
              <>
                  <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: t('game.youCanUseThisWordButNotWin'),
                    }}
                  />
                  <br />
              </>
              )}
              {!isProcessing && tiptext && (
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
