import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE } from '@const';

import { GameMode, GameStatus } from '@common-types';

import { useSelector, useDispatch } from '@store';
import { setToast, toggleShareWords } from '@store/appSlice';
import { selectGuessesStatsForLetters } from '@store/selectors';
import { getWordsAndLetters } from '@store/selectors';

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
import IconFingerprint from '@components/Icons/IconFingerprint';
import IconLoader from '@components/Icons/IconLoader';
import IconPencil from '@components/Icons/IconPencil';
import IconShareAlt from '@components/Icons/IconShareAlt';

import Word from '@components/Words/Word';

import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';

import EndResultSummary from '@components/EndResult/EndResultSummary';

import './SharedContent.scss';

const SharedContent = ({ shouldShowSettings = false }) => {
    const [isOpen, setIsOpen] = useState(false);
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

    const isValidHash =  !!sharedResult.match(/!\([a-z.0-9-]+\)!/gm);

    if (!isValidHash) {
      // Hash pattern is not correct
      return;
    }

    setHash(sharedResult);

    setTimeout(() => {
        setIsOpen(true);
    }, 1)
  }, []);

  useEffect(() => {
    if (hash) {
      (async () => {
        // try {
          const {
            wordToGuess,
            correct,
            position,
            keysWithIndexes,
          } = await getGameResultFromUrlHash(hash);

          const wordsFromIndexes = await getWordsFromKeysWithIndexes(keysWithIndexes);

          console.log({
            wordToGuess,
            correct,
            position,
            keysWithIndexes,
          });
          console.log('words', wordsFromIndexes);

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

  if (!hash) {
    return null;
  }

  return (
    <>
      <button
        className={clsx('shared-content-header-button', 'header-button', 'has-tooltip', 'has-tooltip-from-right', {
          'shared-content-header-button-active': isOpen
        })}
        onClick={() => setIsOpen(value => !value)}
      >
          <IconShareAlt />
          <span className="tooltip">{t(isOpen ? 'common.close' : 'settings.sharedContentTitle')}</span>
      </button>
      <Modal classNameWraper="modal-wrapper--shared-content" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3>{t('settings.sharedContentTitle')}</h3>
        {guesses.length === 0 ? <>
          {hash ? <IconLoader className="shared-content-loader" /> : ''}
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
              <summary onClick={handleClickSummary}>
                  <h2>{t('settings.sharedWordsTitle')}</h2>
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
        </>}
      </Modal>
    </>
  )
};

export default SharedContent;
