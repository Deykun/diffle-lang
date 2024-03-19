import clsx from 'clsx';
import {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Word as WordInterface, AffixStatus } from '@common-types';

import { getWordReport } from '@api/getWordReport';

import { useSelector } from '@store';
import {
  selectWordToSubmit,
} from '@store/selectors';

import IconEgg from '@components/Icons/IconEgg';
import IconFlask from '@components/Icons/IconFlask';

import Word from './Word';

import './WordSandbox.scss';

const EMPY_WORD: WordInterface = {
  word: ' ',
  affixes: [{ type: AffixStatus.New, text: ' ' }],
};

const WordSandbox = () => {
  const wordToSubmit = useSelector(selectWordToSubmit);
  const lang = useSelector(state => state.game.language);
  const wordToGuess = useSelector(state => state.game.wordToGuess);
  const setTimeoutDelay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedWord, setDebouncedWord] = useState(wordToSubmit || ' ');
  const [guess, setGuess] = useState<WordInterface>(EMPY_WORD);

  useEffect(() => {
    console.log('elo', wordToSubmit);
  }, []);

  useEffect(() => {
    (async () => {
      if (!lang || !debouncedWord) {
        console.log('EMPTY');
        setGuess(EMPY_WORD);

        return;
      }

      const {
        affixes = [],
      } = await getWordReport(wordToGuess, debouncedWord, { lang, shouldCheckIfExist: false }) || {};

      console.log('Hasło', debouncedWord);
      setGuess({
        word: debouncedWord,
        affixes,
      });
    })();
  }, [lang, wordToGuess, debouncedWord]);

  useEffect(() => {
    if (setTimeoutDelay.current) {
      clearTimeout(setTimeoutDelay.current);
    }

    setTimeoutDelay.current = setTimeout(() => {
      setDebouncedWord(wordToSubmit);
    }, 800);
  }, [wordToSubmit]);

  return (
      <div className="word-sandbox-wrapper">
          <IconFlask className="word-sanbox-icon" />
          <div className="word-sandbox">
              <Word guess={guess} />
          </div>
      </div>
  );
};

export default WordSandbox;
