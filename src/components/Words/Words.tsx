import classNames from 'clsx';

import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS } from '@const';

import IconEye from '@components/Icons/IconEye'
import IconDashedCircle from '@components/Icons/IconDashedCircle';

import Win from '@components/Win/Win';

import Word from './Word';

import './Words.scss';

const Words = ({ typedWord }) => {
  const guesses = useSelector((state) => state.game.guesses);
  const isWin = useSelector((state) => state.game.isWin);
  const hasLongGuesses = useSelector((state) => state.game.hasLongGuesses);
  const isProcessing = useSelector((state) => state.game.isProcessing);
  const wordToSubmit = useSelector((state) => state.game.wordToSubmit);
  const hasSpace = wordToSubmit.includes(' ');

  const submitGuess = useMemo(() => {
    const affixes = (wordToSubmit || ' ').split('').map(letter => ({ type: 'new', text: letter }));

    return {
      affixes,
    };
  }, [wordToSubmit]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [wordToSubmit])

  // hasLongGuesses

  return (
    <div className={classNames('words', { 'has-long': hasLongGuesses || wordToSubmit.length > WORD_IS_CONSIDER_LONG_AFTER_X_LETTERS })}>
        <IconEye className="icon-focus" />
        {guesses.map((guess, index) => {            
            return (
                <Word key={`guess-${index}`} guess={guess} />
            );
        })}
        <Choose>
          <When condition={isWin}>
            <Win />
          </When>
          <Otherwise>
            <Word guess={submitGuess} />
          </Otherwise>
        </Choose>
        <Choose>
          <When condition={isProcessing}>
            <p className="status processing">
              <IconDashedCircle /> <span>sprawdzanie...</span>
            </p>
          </When>
          <When condition={hasSpace}>
            <p className="status space">
              <small>Hasło nie mają spacji, ale możesz jej używać zamiast X.</small>
            </p>
          </When>
          <Otherwise>
            <p className="status"></p>
          </Otherwise>
        </Choose>
    </div>
  )
};

export default Words;
