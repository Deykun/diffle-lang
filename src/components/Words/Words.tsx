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
  const { status: keyboardStatus, details: keyboardDetails } = useSelector(selectKeyboardState);
  const caretShift = useSelector(state => state.game.caretShift);
  const hasSpace = wordToSubmit.includes(' ');
  const isIncorrectType = [AffixStatus.Incorrect, AffixStatus.IncorrectOccurance].includes(
    wordStatus,
  )
    || [
      AffixStatus.IncorrectStart,
      AffixStatus.IncorrectMiddle,
      AffixStatus.IncorrectOrder,
      AffixStatus.IncorrectEnd,
    ].includes(keyboardStatus);

  const { t } = useTranslation();

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

  const { isImpossibleToWin, tipText, tipDetails } = useMemo(() => {
    let text = '';
    let details = '';
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let isImpossibleToWin = false;

    if (isProcessing) {
      text = 'game.checking';
    } else if (wordStatus === AffixStatus.Incorrect) {
      isImpossibleToWin = true;
      text = 'game.youCanUseIncorrectLetters';
    } else if (wordStatus === AffixStatus.IncorrectOccurance) {
      isImpossibleToWin = true;
      text = 'game.youCanUseLettersTypedTooManyTimes';
    } else if (keyboardStatus === AffixStatus.IncorrectStart) {
      isImpossibleToWin = true;
      details = keyboardDetails ?? '';
      text = 'game.youCanUseIncorrectStart';
    } else if (keyboardStatus === AffixStatus.IncorrectMiddle) {
      isImpossibleToWin = true;
      details = keyboardDetails ?? '';
      text = 'game.youCanUseIncorrectMiddle';
    } else if (keyboardStatus === AffixStatus.IncorrectOrder) {
      isImpossibleToWin = true;
      details = keyboardDetails ?? '';
      text = 'game.youCanUseIncorrectOrder';
    } else if (keyboardStatus === AffixStatus.IncorrectEnd) {
      isImpossibleToWin = true;
      details = keyboardDetails ?? '';
      text = 'game.youCanUseIncorrectEnd';
    } else if (hasSpace) {
      text = 'game.youCanUseSpace';
    }

    return {
      isImpossibleToWin,
      tipText: text,
      tipDetails: details,
    };
  }, [hasSpace, isProcessing, keyboardStatus, keyboardDetails, wordStatus]);

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
          <WordTip />
          {guesses.map((guess) => {
            return <Word key={`guess-${guess.word}`} guess={guess} isSubmitted />;
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
              {tipText && (
              <>
                  <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: t(tipText),
                    }}
                  />
                  {tipDetails && (
                  <span className="status-tip-details">
                      (
                      <strong>
                          {tipDetails}
                      </strong>
                      )
                  </span>
                  )}
              </>
              )}
          </p>
      </div>
  );
};

export default Words;
