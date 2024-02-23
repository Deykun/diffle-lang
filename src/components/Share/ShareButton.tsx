/* eslint-disable max-len */
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE, SUPPORTED_DICTIONARY_BY_LANG } from '@const';

import { GameMode, GameStatus } from '@common-types';

import { useSelector, useDispatch } from '@store';
import { setToast, toggleShareWords } from '@store/appSlice';
import { selectGuessesStatsForLetters } from '@store/selectors';

import { getWordsIndexesChunks } from '@api/getDoesWordExist';

import { copyMessage } from '@utils/copyMessage';
import { getNow } from '@utils/date';
import { getUrlHashForGameResult, maskValue } from '@utils/urlHash';

import useVibrate from '@hooks/useVibrate';

import IconFingerprint from '@components/Icons/IconFingerprint';
import IconPencil from '@components/Icons/IconPencil';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';

import './ShareButton.scss';

interface Props {
  shouldShowSettings?: boolean,
}

const ShareButton = ({ shouldShowSettings = false }: Props) => {
  const dispatch = useDispatch();
  const gameLanguage = useSelector(state => state.game.language);
  const shouldShareWords = useSelector(state => state.app.shouldShareWords);
  const guesses = useSelector(state => state.game.guesses);
  const guessedWords = guesses.map(({ word }) => word);
  const { words, letters, subtotals } = useSelector(selectGuessesStatsForLetters);
  const endStatus = useSelector(state => state.game.status);
  const wordToGuess = useSelector(state => state.game.wordToGuess);
  const gameMode = useSelector(state => state.game.mode);
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();
  const { vibrate } = useVibrate();

  const textToCopy = useMemo(() => {
    const diffleUrl = window.location.href.split('?')[0];
    const { stamp } = getNow();

    const isLost = endStatus === GameStatus.Lost;

    let resultParam = '';
    const langShareMarker = gameLanguage ? SUPPORTED_DICTIONARY_BY_LANG[gameLanguage].shareMarker : '#diffle';
    if (shouldShareWords && gameLanguage) {
      const wordsWithIndexes = getWordsIndexesChunks(guessedWords, gameLanguage);

      const hashedValue = getUrlHashForGameResult({ subtotals, wordToGuess, wordsWithIndexes });

      resultParam = maskValue(hashedValue);
    }

    const shareUrl = `${diffleUrl}${resultParam ? `?r=${resultParam}` : ''}`;

    const copyTitle = gameMode === GameMode.Daily ? `${stamp} – ${langShareMarker}` : `« ${wordToGuess} » – ${langShareMarker}`;
    const copySubtotals = `🟢 ${subtotals.correct}  🟡 ${subtotals.position}  ⚪ ${subtotals.incorrect}  🔴 ${subtotals.typedKnownIncorrect}`;

    if (isLost) {
      return `${copyTitle}

🏳️ ${t('end.in', { postProcess: 'interval', count: words })} ${words} ${t('end.inWordsUsed', { postProcess: 'interval', count: words })} (${letters} ${t('end.lettersUsedShort')})
${copySubtotals}
      
${shareUrl}`;
    }
    return `${copyTitle}

${letters} ${t('end.lettersUsed', { postProcess: 'interval', count: letters })} ${t('end.in', { postProcess: 'interval', count: words })} ${words} ${t('end.inWordsUsed', { postProcess: 'interval', count: words })}
${copySubtotals}

${shareUrl}`;
  }, [endStatus, gameLanguage, gameMode, guessedWords, letters, shouldShareWords, subtotals, t, wordToGuess, words]);

  const handleCopy = useCallback(() => {
    setIsOpen(false);
    copyMessage(textToCopy);

    dispatch(setToast({ text: 'common.copied' }));
  }, [textToCopy, dispatch]);

  const handleToggleShareWords = useCallback(() => {
    vibrate();

    localStorage.setItem(LOCAL_STORAGE.SHOULD_SHARE_WORDS, shouldShareWords ? 'false' : 'true');

    dispatch(toggleShareWords());
  }, [dispatch, shouldShareWords, vibrate]);

  const onClick = () => setIsOpen(value => !value);

  return (
      <>
          <span className="buttons-connected">
              <Button
                onClick={handleCopy}
              >
                  <IconShare />
                  <span>{t('common.copyResult')}</span>
              </Button>
              {shouldShowSettings && (
              <Button onClick={onClick}>
                  <IconPencil />
              </Button>
              )}
          </span>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className="settings">
                  <h3>{t('share.titleSettings')}</h3>
                  <ul>
                      <li>
                          <button
                            className={clsx('setting', { 'setting-active': shouldShareWords })}
                            onClick={handleToggleShareWords}
                            type="button"
                          >
                              <IconFingerprint />
                              <span>
                                  {t('share.linkWithUsedWords')}
                                  <br />
                                  <small className="share-no-spoiler">{t('share.linkWithUsedWordsNoSpoilers')}</small>
                              </span>
                          </button>
                      </li>
                      <li>
                          <button
                            className="setting"
                            onClick={handleCopy}
                            type="button"
                          >
                              <IconShare />
                              <span>{t('common.copyResult')}</span>
                          </button>
                      </li>
                  </ul>
              </div>
          </Modal>
      </>
  );
};

export default ShareButton;
