import {
  useState, useEffect, useRef,
} from 'react';
import clsx from 'clsx';

import { Word as WordType, AffixStatus } from '@common-types';

import { getWordReport } from '@api/getWordReport';

import { useSelector } from '@store';
import {
  selectWordToSubmit,
} from '@store/selectors';

import Word from './Word';

import './WordSandboxLive.scss';

const EMPY_WORD: WordType = {
  word: ' ',
  affixes: [{ type: AffixStatus.New, text: ' ' }],
};

const WordSandboxLive = () => {
  const wordToSubmit = useSelector(selectWordToSubmit);
  const lang = useSelector(state => state.game.language);
  const wordToGuess = useSelector(state => state.game.wordToGuess);
  const setTimeoutDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setTimeoutThrottle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [delayedWord, setDelayedWord] = useState(wordToSubmit || ' ');
  const [guess, setGuess] = useState<WordType>(EMPY_WORD);

  useEffect(() => {
    (async () => {
      if (!lang || !delayedWord) {
        setGuess(EMPY_WORD);

        return;
      }

      const {
        affixes = [],
      } = await getWordReport(wordToGuess, delayedWord, { lang, shouldCheckIfExist: false }) || {};

      setGuess({
        word: delayedWord,
        affixes,
      });
    })();
  }, [lang, wordToGuess, delayedWord]);

  useEffect(() => {
    if (setTimeoutDebounce.current) {
      clearTimeout(setTimeoutDebounce.current);
    }

    setTimeoutDebounce.current = setTimeout(() => {
      setDelayedWord(wordToSubmit);

      if (setTimeoutThrottle.current) {
        clearTimeout(setTimeoutThrottle.current);
        setTimeoutThrottle.current = null;
      }
    }, 1000);

    return () => {
      if (setTimeoutDebounce.current) {
        clearTimeout(setTimeoutDebounce.current);
        setTimeoutDebounce.current = null;
      }
    };
  }, [wordToSubmit]);

  useEffect(() => {
    if (setTimeoutThrottle.current === null) {
      setTimeoutThrottle.current = setTimeout(() => {
        setDelayedWord(wordToSubmit);

        setTimeoutThrottle.current = null;
      }, 200);
    }

    return () => {
      if (setTimeoutThrottle.current) {
        clearTimeout(setTimeoutThrottle.current);
        setTimeoutThrottle.current = null;
      }
    };
  }, [wordToSubmit]);

  return (
      <div className={clsx('word-sandbox-wrapper', {
        'word-sandbox-wrapper--correct': delayedWord === wordToGuess,
      })}
      >
          {/* <IconFlask className="word-sanbox-icon" /> */}
          <span className="word-sanbox-icon">
              <span>LIVE</span>
          </span>
          <div className="word-sandbox">
              <Word guess={guess} />
          </div>
      </div>
  );
};

export default WordSandboxLive;
