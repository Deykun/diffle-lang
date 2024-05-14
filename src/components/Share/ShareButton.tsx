/* eslint-disable max-len */
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { LOCAL_STORAGE, SUPPORTED_DICTIONARY_BY_LANG } from '@const';

import { GameMode, GameStatus } from '@common-types';

import { useSelector, useDispatch } from '@store';
import { track, setToast, toggleShareWords } from '@store/appSlice';
import {
  selectIsTodayEasterDay,
  selectGuessesStatsForLetters,
} from '@store/selectors';

import { getWordsIndexesChunks } from '@api/getDoesWordExist';
import { getEasterDayInfoIfFetched } from '@api/getWordToGuess';

import { copyMessage } from '@utils/copyMessage';
import { getNow } from '@utils/date';
import { getUrlHashForGameResult, maskValue } from '@utils/urlHash';
import {
  getRandomItem,
} from '@utils/ts';

import useVibrate from '@hooks/useVibrate';

import IconCopy from '@components/Icons/IconCopy';
import IconCopyAlt from '@components/Icons/IconCopyAlt';
import IconFingerprint from '@components/Icons/IconFingerprint';
import IconPencil from '@components/Icons/IconPencil';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';
import ButtonTile from '@components/Button/ButtonTile';
import Modal from '@components/Modal/Modal';

import './ShareButton.scss';

type Emojis = {
  correct?: string,
  position?: string,
  incorrect?: string,
  typedKnownIncorrect?: string,
};

const DEFAULT_EMOJIS: Emojis = {
  correct: '🟢',
  position: '🟡',
  incorrect: '⚪',
  typedKnownIncorrect: '🔴',
};

type Props = {
  shouldShowSettings?: boolean,
}

const ShareButton = ({ shouldShowSettings = false }: Props) => {
  const dispatch = useDispatch();
  const gameLanguage = useSelector(state => state.game.language);
  const shouldShareWords = useSelector(state => state.app.shouldShareWords);
  const guesses = useSelector(state => state.game.guesses);
  const guessedWords = guesses.map(({ word }) => word);
  const isTodayEasterDay = useSelector(selectIsTodayEasterDay);
  const { words, letters, subtotals } = useSelector(selectGuessesStatsForLetters);
  const endStatus = useSelector(state => state.game.status);
  const wordToGuess = useSelector(state => state.game.wordToGuess);
  const gameMode = useSelector(state => state.game.mode);
  const [isOpen, setIsOpen] = useState(false);
  const [emojis, setEmojis] = useState<Emojis>({});

  const { t } = useTranslation();
  const { vibrate } = useVibrate();

  useEffect(() => {
    if (!gameLanguage || !isTodayEasterDay) {
      setEmojis({});
    } else {
      const { emojis: customEmojisSets } = getEasterDayInfoIfFetched(gameLanguage) || {};

      if (Array.isArray(customEmojisSets)) {
        const emojisSet = getRandomItem(customEmojisSets);

        if (emojisSet) {
          const customEmojis = {
            correct: getRandomItem(emojisSet.correct),
            position: getRandomItem(emojisSet.position),
            incorrect: getRandomItem(emojisSet.incorrect),
            typedKnownIncorrect: getRandomItem(emojisSet.typedKnownIncorrect),
          };

          setEmojis(customEmojis);
        }
      }
    }

    return () => {
      setEmojis({});
    };
  }, [gameLanguage, isTodayEasterDay]);

  const linkToCopy = useMemo(() => {
    const diffleUrl = window.location.href.split('?')[0];

    let resultParam = '';
    if (shouldShareWords && gameLanguage) {
      const wordsWithIndexes = getWordsIndexesChunks(guessedWords, gameLanguage);

      const { dayIntoYear } = getNow();

      const hashedValue = getUrlHashForGameResult({
        subtotals,
        wordToGuess,
        dayIntoYear,
        wordsWithIndexes,
      });

      resultParam = maskValue(hashedValue);
    }

    return `${diffleUrl}${resultParam ? `?r=${resultParam}` : ''}`;
  }, [gameLanguage, guessedWords, shouldShareWords, subtotals, wordToGuess]);

  const textToCopy = useMemo(() => {
    const { stamp } = getNow();

    const isLost = endStatus === GameStatus.Lost;

    const langShareMarker = gameLanguage ? SUPPORTED_DICTIONARY_BY_LANG[gameLanguage].shareMarker : '#diffle';

    const copyTitle = gameMode === GameMode.Daily ? `${stamp} – ${langShareMarker}` : `« ${wordToGuess} » – ${langShareMarker}`;
    const copySubtotals = `${emojis.correct || DEFAULT_EMOJIS.correct} ${subtotals.correct}  ${emojis.position || DEFAULT_EMOJIS.position} ${subtotals.position}  ${emojis.incorrect || DEFAULT_EMOJIS.incorrect} ${subtotals.incorrect}  ${emojis.typedKnownIncorrect || DEFAULT_EMOJIS.typedKnownIncorrect} ${subtotals.typedKnownIncorrect}`;

    if (isLost) {
      return `${copyTitle}

🏳️ ${t('end.in', { postProcess: 'interval', count: words })} ${words} ${t('end.inWordsUsed', { postProcess: 'interval', count: words })} (${letters} ${t('end.lettersUsedShort')})
${copySubtotals}
      
${linkToCopy}`;
    }
    return `${copyTitle}

${letters} ${t('end.lettersUsed', { postProcess: 'interval', count: letters })} ${t('end.in', { postProcess: 'interval', count: words })} ${words} ${t('end.inWordsUsed', { postProcess: 'interval', count: words })}
${copySubtotals}

${linkToCopy}`;
  }, [emojis.correct, emojis.incorrect, emojis.position, emojis.typedKnownIncorrect, endStatus, gameLanguage, gameMode, letters, linkToCopy, subtotals.correct, subtotals.incorrect, subtotals.position, subtotals.typedKnownIncorrect, t, wordToGuess, words]);

  const handleCopy = useCallback(() => {
    if (!gameLanguage) {
      return;
    }

    setIsOpen(false);
    copyMessage(textToCopy);

    dispatch(setToast({ text: 'common.copied' }));

    dispatch(track({
      name: 'game_result_copied',
      params: {
        lang: gameLanguage,
        letters,
        words,
      },
    }));
  }, [gameLanguage, textToCopy, dispatch, letters, words]);

  const handleCopyOnlyLink = useCallback(() => {
    if (!gameLanguage) {
      return;
    }

    setIsOpen(false);
    copyMessage(linkToCopy);

    dispatch(setToast({ text: 'common.copied' }));

    dispatch(track({
      name: 'game_result_link_copied',
      params: {
        lang: gameLanguage,
        letters,
        words,
      },
    }));
  }, [gameLanguage, linkToCopy, dispatch, letters, words]);

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
                  <ul className="list-col-3">
                      <li>
                          <ButtonTile
                            isActive={shouldShareWords}
                            onClick={handleToggleShareWords}
                          >
                              <IconFingerprint />
                              <span>
                                  {t('share.linkWithUsedWords')}
                                  <br />
                                  <small className="share-no-spoiler">{t('share.linkWithUsedWordsNoSpoilers')}</small>
                              </span>
                          </ButtonTile>
                      </li>
                      <li>
                          <ButtonTile
                            onClick={handleCopyOnlyLink}
                          >
                              <IconCopyAlt />
                              <span>{t('common.copyResultLink')}</span>
                          </ButtonTile>
                      </li>
                      <li>
                          <ButtonTile
                            onClick={handleCopy}
                          >
                              <IconCopy />
                              <span>{t('common.copyResult')}</span>
                          </ButtonTile>
                      </li>
                  </ul>
              </div>
          </Modal>
      </>
  );
};

export default ShareButton;
