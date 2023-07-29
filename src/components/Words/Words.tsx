import classNames from 'clsx';
import { useEffect, useMemo } from 'react';

import { WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

import { useSelector } from '@store';

import { Word as WordInterface } from '@common-types';


import IconEye from '@components/Icons/IconEye'
import IconDashedCircle from '@components/Icons/IconDashedCircle';

import Win from '@components/Win/Win';

import Word from './Word';

import './Words.scss';

const Words = () => {
  const guesses = useSelector((state) => state.game.guesses);
  const isWon = useSelector((state) => state.game.isWon);
  const hasLongGuesses = useSelector((state) => state.game.hasLongGuesses);
  const isProcessing = useSelector((state) => state.game.isProcessing);
  const wordToSubmit = useSelector((state) => state.game.wordToSubmit);
  const hasSpace = wordToSubmit.includes(' ');

  const submitGuess: WordInterface = useMemo(() => {
    const affixes = (wordToSubmit || ' ').split('').map(letter => ({ type: 'new', text: letter }));

    return {
      word: wordToSubmit,
      affixes,
    };
  }, [wordToSubmit]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [wordToSubmit])

  const shouldBeSmaller = hasLongGuesses || wordToSubmit.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS || guesses.length > 8;

  return (
    <div className={classNames('words', { 'zoom-out': shouldBeSmaller })}>
        <IconEye className="icon-focus" />
        {guesses.map((guess, index) => {            
            return (
                <Word key={`guess-${index}`} guess={guess} />
            );
        })}
        {isWon ? <Win /> : <Word guess={submitGuess} />}
        <p
          className={classNames('status', {
            'processing': isProcessing,
            'space': hasSpace,
          })}
        >
          {isProcessing && (<><IconDashedCircle /> <span>sprawdzanie...</span></>)}
          {!isProcessing && hasSpace && <small>Hasło nie mają spacji, ale możesz jej używać (zostanie usunięta
            ).</small>}
        </p>
    </div>
  )
};

export default Words;
