import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Word as WordInterface, AffixStatus } from '@common-types';

import { getWordReport } from '@api/getWordReport';

import { useSelector } from '@store';
import {
  selectGameLanguageKeyboardInfo,
  selectHasWordToGuessSpecialCharacters,
} from '@store/selectors';

import IconEgg from '@components/Icons/IconEgg';

import Word from './Word';

import './WordSandbox.scss';

interface Props {
  word: string,
}

const EMPY_WORD: WordInterface = {
  word: ' ',
  affixes: [{ type: AffixStatus.New, text: ' ' }],
};

const WordSandbox = ({
  word: wordToSubmit,
}: Props) => {
  const [guess, setGuess] = useState<WordInterface>(EMPY_WORD);
  const lang = useSelector(state => state.game.language);
  const wordToGuess = useSelector(state => state.game.wordToGuess);

  // TODO debounce
  useEffect(() => {
    (async () => {
      if (!lang || !wordToSubmit) {
        setGuess(EMPY_WORD);

        return;
      }

      const {
        word = '',
        affixes = [],
      } = await getWordReport(wordToGuess, (wordToSubmit || ' '), { lang, shouldCheckIfExist: false }) || {};

      setGuess({
        word,
        affixes,
      });
    })();

    return () => {
      setGuess(EMPY_WORD);
    };
  }, [lang, wordToGuess, wordToSubmit]);

  return (
      <div className="word-sandbox">
          <IconEgg className="word-sanbox-icon" />
          <Word guess={guess} />
      </div>
  );
};

export default WordSandbox;
