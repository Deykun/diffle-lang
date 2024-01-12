import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE } from '@const';

import { Pane, GameStatus, GameMode } from '@common-types';

import { useSelector, useDispatch } from '@store';
import { setToast, toggleShareWords } from '@store/appSlice';
import { selectIsGameEnded } from '@store/selectors';
import { getWordsAndLetters } from '@store/selectors';

import { getInitPane } from '@api/getInit';
import { getWordsFromKeysWithIndexes } from '@api/getDoesWordExist';
import { getWordReportForMultipleWords, WordReport } from '@api/getWordReport';

// getWordsFromKeysWithIndexes

import { copyMessage } from '@utils/copyMessage';
import { getNow } from '@utils/date';
import { getHasSpecialCharacters } from '@utils/normilzeWord';
import { demaskValue, getGameResultFromUrlHash } from '@utils/urlHash';

import useVibrate from '@hooks/useVibrate';
import useEnhancedDetails from '@hooks/useEnhancedDetails';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';
import IconClose from '@components/Icons/IconClose';
import IconDay from '@components/Icons/IconDay';
import IconFingerprint from '@components/Icons/IconFingerprint';
import IconLoader from '@components/Icons/IconLoader';
import IconLoaderError from '@components/Icons/IconLoaderError';

import IconPencil from '@components/Icons/IconPencil';
import IconShareAlt from '@components/Icons/IconShareAlt';

import Word from '@components/Words/Word';

import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';

import EndResultSummary from '@components/EndResult/EndResultSummary';

import './SharedContent.scss';

const SharedContent = () => {
  const isGameEnded = useSelector(selectIsGameEnded);
  const gameMode = useSelector(state => state.game.mode);
  const canUserSeeUsedWords = (gameMode === GameMode.Daily && isGameEnded) || gameMode === GameMode.Practice;
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hash, setHash] = useState('');
  const [{ isWon, wordToGuess, guesses,
    words,
    letters,
    subtotals
  }, setResult] = useState({
    isWon: false,
    wordToGuess: '',
    guesses: [],
    words: 0,
    letters: 0,
    subtotals: {}
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

    console.log('sharedResult', sharedResult);

    const isValidHash =  !!sharedResult.match(/!\([a-z.0-9-]+\)!/gm);

    if (!isValidHash) {
      // Hash pattern is not correct
      setErrorMessage('share.resultIsBroken');

      return;
    }

    setHash(sharedResult);

    const isFirstGame = getInitPane() === Pane.Help;

    console.log('canUserSeeUsedWords', canUserSeeUsedWords);
    const shouldAutoOpenSharedResult = !isFirstGame && canUserSeeUsedWords;

    if (shouldAutoOpenSharedResult) {
      setTimeout(() => {
        setIsOpen(true);
      }, 1)
    }
  }, []);

  useEffect(() => {
    if (hash) {
      (async () => {
        // try {
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
            results: guesses,
          } = await getWordReportForMultipleWords(wordToGuess, wordsFromIndexes);

          // console.log('x', x);
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
            // Probably dictionary changed and we can't recover the result

            setErrorMessage('share.resultHasExpired');
            // setIsOpen(false);

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

        // } catch {

        // }
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
            status={isWon ? 'won' : 'lost'}
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
