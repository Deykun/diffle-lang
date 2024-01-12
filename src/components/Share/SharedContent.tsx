import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Pane, GameStatus, GameMode, Word as WordInterface } from '@common-types';

import { useSelector } from '@store';
import { selectIsGameEnded } from '@store/selectors';
import { getWordsAndLetters } from '@store/selectors';

import { getInitPane } from '@api/getInit';
import { getWordsFromKeysWithIndexes } from '@api/getDoesWordExist';
import { getWordReportForMultipleWords } from '@api/getWordReport';

import { getHasSpecialCharacters } from '@utils/normilzeWord';
import { demaskValue, getGameResultFromUrlHash } from '@utils/urlHash';

import useEnhancedDetails from '@hooks/useEnhancedDetails';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';
import IconFingerprint from '@components/Icons/IconFingerprint';
import IconLoader from '@components/Icons/IconLoader';

import IconShareAlt from '@components/Icons/IconShareAlt';

import Word from '@components/Words/Word';

import Modal from '@components/Modal/Modal';

import EndResultSummary from '@components/EndResult/EndResultSummary';

import './SharedContent.scss';

interface SharedContentResult {
  isWon: boolean,
  wordToGuess: string,
  guesses: WordInterface[],
  words: number,
  letters: number,
  subtotals: {
    correct: number,
    position: number,
    incorrect: number,
    typedKnownIncorrect: number,
  }
}

const SharedContent = () => {
  const isGameEnded = useSelector(selectIsGameEnded);
  const gameMode = useSelector(state => state.game.mode);
  const canUserSeeUsedWords = (gameMode === GameMode.Daily && isGameEnded) || gameMode === GameMode.Practice;
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hash, setHash] = useState('');
  const [{
    isWon,
    wordToGuess,
    guesses,
    words,
    letters,
    subtotals
  }, setResult] = useState<SharedContentResult>({
    isWon: false,
    wordToGuess: '',
    guesses: [],
    words: 0,
    letters: 0,
    subtotals: {
      correct: 0,
      position: 0,
      incorrect: 0,
      typedKnownIncorrect: 0,
    }
  });

  const { t } = useTranslation();

  const { handleClickSummary } = useEnhancedDetails();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const sharedMaskedResult = urlParams.get('r');
    if (!sharedMaskedResult) {
      return;
    }

    const sharedResult = demaskValue(sharedMaskedResult);

    const isValidHash =  !!sharedResult.match(/!\([a-z.0-9-]+\)!/gm);

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
      }, 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hash) {
      (async () => {
        try {
          const {
            wordToGuess,
            correct: hashCorrect,
            position: hashPosition,
            incorrect: hashIncorrect,
            typedKnownIncorrect: hashTypedKnowIncorrect,
            keysWithIndexes,
          } = await getGameResultFromUrlHash(hash);

          const wordsFromIndexes = await getWordsFromKeysWithIndexes(keysWithIndexes);

          const {
            isWon,
            results,
          } = await getWordReportForMultipleWords(wordToGuess, wordsFromIndexes);

          const guesses = results.map(({ word = '', affixes = [] }) => ({
            word,
            affixes,
          }));

          const hasSpecialCharacters = getHasSpecialCharacters(wordToGuess);

          const {
            words,
            letters,
            subtotals,
          } = getWordsAndLetters(guesses, hasSpecialCharacters);

          const isHashResultSameToCalculated = hashCorrect === subtotals.correct
            && hashPosition === subtotals.position
            && hashIncorrect === subtotals.incorrect
            && hashTypedKnowIncorrect === subtotals.typedKnownIncorrect;

          if (!isHashResultSameToCalculated) {
            // Probably dictionary has been changed and we can't recover the result
            setErrorMessage('share.resultHasExpired');

            return;
          }

          setResult({
            wordToGuess,
            isWon,
            guesses,
            words,
            letters,
            subtotals,
          });

        } catch {
          setErrorMessage('share.resultIsBroken');
        }
      })();
    }
  }, [hash]);

  if (!hash && !errorMessage) {
    return null;
  }

  return (
    <>
      <button
        className={clsx('shared-content-header-button', 'header-button', 'has-tooltip', 'has-tooltip-from-right', {
          'shared-content-header-button-active': isOpen,
          'has-tooltip-activated': !isOpen && !errorMessage && canUserSeeUsedWords,
        })}
        onClick={() => setIsOpen(value => !value)}
      >
          <IconShareAlt />
          <span className="tooltip">{t('share.titleSharedResult')}</span>
      </button>
      <Modal classNameWraper="modal-wrapper--shared-content" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3>{t('share.titleSharedResult')}</h3>
        {guesses.length === 0 ? <>
          {hash && !errorMessage ? <p><IconLoader className="shared-content-loader" /></p> : ''}
          {errorMessage ? <p className="shared-content-error">{t(errorMessage)}</p> : ''}
        </> : <>
          <EndResultSummary
            status={isWon ? GameStatus.Won : GameStatus.Lost}
            wordToGuess={wordToGuess}
            guesses={guesses}
            words={words}
            letters={letters}
            subtotals={subtotals}
          />
          <br />
          <details>
              <summary className={clsx({
                'summary-disabled': !canUserSeeUsedWords,
              })} onClick={handleClickSummary}>
                  <h2>{t('share.titleUsedWords')}</h2>
                  <IconAnimatedCaret className="details-icon" />
              </summary>
              <div className="details-content shared-content-words">
                  {guesses.map((guess, index) => {            
                    return (
                        <Word key={`guess-${index}`} guess={guess} />
                    );
                  })}
              </div>
          </details>
          {!canUserSeeUsedWords && <p className="shared-content-words-why-blocked"><IconFingerprint /><span>{t('settings.labelFinishGameLonger')}</span></p>}
        </>}
      </Modal>
    </>
  )
};

export default SharedContent;
