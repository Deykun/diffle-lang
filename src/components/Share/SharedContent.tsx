import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Pane, GameStatus, GameMode, Word as WordType,
} from '@common-types';

import { WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

import { useDispatch, useSelector } from '@store';
import { selectIsGameEnded, getWordsAndLetters } from '@store/selectors';
import { track } from '@store/appSlice';

import { getInitPane } from '@api/getInit';
import { getWordsFromKeysWithIndexes } from '@api/getDoesWordExist';
import { getWordReportForMultipleWords } from '@api/getWordReport';
import getWordToGuess from '@api/getWordToGuess';

import { getCssVarMillisecondsValue } from '@utils/css';
import { removeDiacratics } from '@api/helpers';
import { getNow, getTommorowSeed } from '@utils/date';
import { getHasSpecialCharacters } from '@utils/normilzeWord';
import { demaskValue, getGameResultFromUrlHash } from '@utils/urlHash';
import { getLangFromUrl } from '@utils/lang';

import useEnhancedDetails from '@hooks/useEnhancedDetails';
import usePrevious from '@hooks/usePrevious';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';
import IconEraser from '@components/Icons/IconEraser';
import IconFingerprint from '@components/Icons/IconFingerprint';
import IconLoader from '@components/Icons/IconLoader';

import IconShareAlt from '@components/Icons/IconShareAlt';

import Word from '@components/Words/Word';

import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';

import EndResultSummary from '@components/EndResult/EndResultSummary';

import './SharedContent.scss';

type SharedContentResult = {
  isWon: boolean,
  wordToGuess: string,
  guesses: WordType[],
  hasLongGuesses: boolean,
  words: number,
  letters: number,
  subtotals: {
    correct: number,
    position: number,
    incorrect: number,
    typedKnownIncorrect: number,
  }
};

const EMPTY_SHARED_CONTENT_RESULT = {
  isWon: false,
  wordToGuess: '',
  guesses: [],
  hasLongGuesses: false,
  words: 0,
  letters: 0,
  subtotals: {
    correct: 0,
    position: 0,
    incorrect: 0,
    typedKnownIncorrect: 0,
  },
};

const SharedContent = () => {
  const dispatch = useDispatch();
  const isGameEnded = useSelector(selectIsGameEnded);
  const gameLanguage = useSelector(state => state.game.language);
  const gameMode = useSelector(state => state.game.mode);
  const canUserSeeUsedWords = (gameMode === GameMode.Daily && isGameEnded) || gameMode === GameMode.Practice;
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hash, setHash] = useState('');
  const [{
    isWon,
    wordToGuess,
    guesses,
    hasLongGuesses,
    words,
    letters,
    subtotals,
  }, setResult] = useState<SharedContentResult>(EMPTY_SHARED_CONTENT_RESULT);

  const prevGameLanguage = usePrevious(gameLanguage);

  const { t } = useTranslation();

  const { handleClickSummary } = useEnhancedDetails();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const sharedMaskedResult = urlParams.get('r');
    if (!sharedMaskedResult) {
      return;
    }

    const sharedResult = demaskValue(sharedMaskedResult);

    const isValidHash = !!removeDiacratics(sharedResult).match(/!\([a-z.0-9-]+\)!/gm);

    if (!isValidHash) {
      // Hash pattern is not correct
      setErrorMessage('share.resultIsBroken');

      return;
    }

    setHash(sharedResult);

    const isFirstGame = getInitPane() === Pane.Help;
    const shouldAutoOpenSharedResult = !isFirstGame && canUserSeeUsedWords;

    if (shouldAutoOpenSharedResult) {
      setTimeout(() => {
        setIsOpen(true);
      }, 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hash) {
      (async () => {
        try {
          const {
            wordToGuess: sharedWordToGuess,
            dayIntoYear: sharedDayIntoYear,
            correct: hashCorrect,
            position: hashPosition,
            incorrect: hashIncorrect,
            typedKnownIncorrect: hashTypedKnowIncorrect,
            keysWithIndexes,
          } = await getGameResultFromUrlHash(hash);

          // That should always be right for shared content
          const langFromUrl = getLangFromUrl();

          if (!langFromUrl) {
            setErrorMessage('share.resultIsBroken');

            return;
          }

          if (typeof sharedDayIntoYear === 'number') {
            const { dayIntoYear } = getNow();

            // We still don't know the year
            const doesDayIntoYearMatchNextDay = (dayIntoYear + 1) === sharedDayIntoYear;
            const doesDayIntoYearMatchNewYear = [365, 366].includes(dayIntoYear) && sharedDayIntoYear === 0;

            const isPossibleSpoiler = doesDayIntoYearMatchNextDay || doesDayIntoYearMatchNewYear;

            if (isPossibleSpoiler) {
              const tommorowSeed = getTommorowSeed();

              if (langFromUrl) {
                const tommorowWord = await getWordToGuess({
                  gameMode: GameMode.Daily,
                  gameLanguage: langFromUrl,
                  seedNumber: tommorowSeed,
                });

                /*
                  The daily mode time changes for the UTC timezone,
                  but if someone changes the time (not the timezone),
                  they are technically in the future.
                */
                const isSpoilerForNextDay = sharedWordToGuess === tommorowWord;
                if (isSpoilerForNextDay) {
                  setErrorMessage('share.resultIsForTheFuture');

                  return;
                }
              }
            }
          }

          const wordsFromIndexes = await getWordsFromKeysWithIndexes(keysWithIndexes, langFromUrl);

          const {
            isWon: sharedIsWon,
            results,
          } = await getWordReportForMultipleWords(sharedWordToGuess, wordsFromIndexes, { lang: langFromUrl });

          const sharedGuesses = results.map(({ word = '', affixes = [] }) => ({
            word,
            affixes,
          }));

          const sharedHasLongGuesses = sharedGuesses.some(({ word }) => word.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS);

          const hasSpecialCharacters = getHasSpecialCharacters(sharedWordToGuess);

          const {
            words: sharedWords,
            letters: sharedLetters,
            subtotals: sharedSubtotals,
          } = getWordsAndLetters(sharedGuesses, hasSpecialCharacters);

          const isHashResultSameToCalculated = hashCorrect === sharedSubtotals.correct
            && hashPosition === sharedSubtotals.position
            && hashIncorrect === sharedSubtotals.incorrect
            && hashTypedKnowIncorrect === sharedSubtotals.typedKnownIncorrect;

          if (!isHashResultSameToCalculated) {
            // Probably dictionary has been changed and we can't recover the result
            setErrorMessage('share.resultHasExpired');

            return;
          }

          dispatch(track({
            name: 'game_result_displayed',
            params: {
              lang: gameLanguage || getLangFromUrl() || 'unknown',
              hash,
            },
          }));

          setResult({
            wordToGuess: sharedWordToGuess,
            isWon: sharedIsWon,
            guesses: sharedGuesses,
            hasLongGuesses: sharedHasLongGuesses,
            words: sharedWords,
            letters: sharedLetters,
            subtotals: sharedSubtotals,
          });
        } catch {
          setErrorMessage('share.resultIsBroken');
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const removeSharedContent = () => {
    window.history.replaceState(null, document.title, window.location.href.replace(window.location.search, ''));
    setIsOpen(false);

    const cssTimeoutMs = getCssVarMillisecondsValue('--modal-duration-close') || 100;

    setTimeout(() => {
      setErrorMessage('');
      setHash('');
      setResult(EMPTY_SHARED_CONTENT_RESULT);
    }, cssTimeoutMs);
  };

  useEffect(() => {
    const wasGameLanguageChanged = prevGameLanguage && gameLanguage !== prevGameLanguage;

    if (wasGameLanguageChanged) {
      removeSharedContent();
    }
  }, [gameLanguage, prevGameLanguage]);

  if (!hash && !errorMessage) {
    return null;
  }

  const shouldBeNarrower = hasLongGuesses;
  const shouldBeShorter = guesses.length > 8;

  return (
      <>
          <button
            className={clsx('shared-content-header-button', 'header-button', 'has-tooltip', 'has-tooltip-from-right', {
              'shared-content-header-button-active': isOpen,
              'has-tooltip-activated': !isOpen && !errorMessage && canUserSeeUsedWords,
            })}
            onClick={() => setIsOpen(value => !value)}
            type="button"
          >
              <IconShareAlt />
              <span className="tooltip">{t('share.titleSharedResult')}</span>
          </button>
          <Modal classNameWraper="modal-wrapper--shared-content" isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <h3>{t('share.titleSharedResult')}</h3>
              {guesses.length === 0 ? (
                  <>
                      {hash && !errorMessage ? <p><IconLoader className="shared-content-loader" /></p> : ''}
                      {errorMessage ? <p className="shared-content-error">{t(errorMessage)}</p> : ''}
                  </>
              ) : (
                  <>
                      <EndResultSummary
                        status={isWon ? GameStatus.Won : GameStatus.Lost}
                        wordToGuess={wordToGuess}
                        guesses={guesses}
                        words={words}
                        letters={letters}
                        subtotals={subtotals}
                      />
                      <br />
                      <details open={canUserSeeUsedWords}>
                          <summary
                            className={clsx({
                              'summary-disabled': !canUserSeeUsedWords,
                            })}
                            onClick={handleClickSummary}
                          >
                              <h2>{t('share.titleUsedWords')}</h2>
                              <IconAnimatedCaret className="details-icon" />
                          </summary>
                          <div className="details-content shared-content-words">
                              <div className={clsx('words', {
                                'words--is-ended': true, narrow: shouldBeNarrower, shorter: shouldBeShorter,
                              })}
                              >
                                  {guesses.map((guess) => {
                                    return (
                                        <Word key={`guess-${guess.word}`} guess={guess} />
                                    );
                                  })}
                              </div>
                          </div>
                      </details>
                      {!canUserSeeUsedWords && (
                      <p className="shared-content-words-tip shared-content-words-tip--blocked">
                          <IconFingerprint />
                          <span>{t('settings.labelFinishGameLonger')}</span>
                      </p>
                      )}
                      {canUserSeeUsedWords && (
                      <p className="shared-content-words-tip shared-content-words-tip--unblocked">
                          <IconFingerprint />
                          <span>{t('settings.labelYouCanSeeSharedWords')}</span>
                      </p>
                      )}
                  </>
              )}
              <Button onClick={removeSharedContent} isInverted isText hasBorder={false}>
                  <IconEraser />
                  <span>{t('share.dontShowThisResult')}</span>
              </Button>
          </Modal>
      </>
  );
};

export default SharedContent;
