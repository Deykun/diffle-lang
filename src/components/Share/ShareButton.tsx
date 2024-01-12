import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE } from '@const';

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

const ShareButton = ({ shouldShowSettings = false }) => {
  const dispatch = useDispatch();
  const shouldShareWords = useSelector((state) => state.app.shouldShareWords);
  const guesses = useSelector((state) => state.game.guesses);
  const guessedWords = guesses.map(({ word }) => word);
  const { words, letters, subtotals } = useSelector(selectGuessesStatsForLetters);
  const endStatus = useSelector((state) => state.game.status);
  const wordToGuess = useSelector((state) => state.game.wordToGuess);
  const gameMode = useSelector((state) => state.game.mode);
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();
  const { vibrate } = useVibrate();

  const textToCopy = useMemo(() => {
    const diffleUrl = location.href.split('?')[0];
    const { stamp } = getNow();

    const isLost = endStatus === GameStatus.Lost;

    let resultParam = '';
    if (shouldShareWords) {
      const wordsWithIndexes = getWordsIndexesChunks(guessedWords);
      const hashedValue = getUrlHashForGameResult({ subtotals, wordToGuess, wordsWithIndexes });

      resultParam = maskValue(hashedValue);
    }

    const shareUrl = `${diffleUrl}${resultParam ? `?r=${resultParam}` : ''}`;

    const copyTitle = gameMode === GameMode.Daily ? `${stamp} – 🇵🇱 #diffle` : `« ${wordToGuess} » – 🇵🇱 #diffle`;
    const copySubtotals = `🟢 ${subtotals.correct}  🟡 ${subtotals.position}  ⚪ ${subtotals.incorrect}  🔴 ${subtotals.typedKnownIncorrect}`;

    if (isLost) {
      return `${copyTitle}

🏳️ ${t('end.lostIn')} ${words} ${t('end.inWordsUsed', { postProcess: 'interval', count: words })} (${letters} ${t('end.lettersUsedShort')})
${copySubtotals}
      
${shareUrl}`;
  }
      return `${copyTitle}

${letters} ${t('end.lettersUsed', { postProcess: 'interval', count: letters })} ${t('end.in')} ${words} ${t('end.inWordsUsed', { postProcess: 'interval', count: words })}
${copySubtotals}

${shareUrl}`;

}, [endStatus, gameMode, guessedWords, letters, shouldShareWords, subtotals, t, wordToGuess, words])

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
      <span>
        <Button
          onClick={handleCopy}
        >
            <IconShare />
            <span>{t('common.copyResult')}</span>
        </Button>
        {shouldShowSettings && (
          <Button
            className="share-settings"
            onClick={onClick}
            isInverted
            isText
            hasBorder={false}
          >
            <IconPencil />
          </Button>
        )}
      </span>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="settings">
          <h3>{t('share.titleSettings')}</h3>
          <ul>
              <li>
                  <button className={clsx('setting', { 'setting-active': shouldShareWords })} onClick={handleToggleShareWords}>
                      <IconFingerprint />
                      <span>{t('share.linkWithUsedWords')}</span>
                  </button>
              </li>
              <li>
                  <button className="setting" onClick={handleCopy}>
                    <IconShare />
                    <span>{t('common.copyResult')}</span>
                  </button>
              </li>
          </ul>
        </div>
      </Modal>
    </>
  )
};

export default ShareButton;
