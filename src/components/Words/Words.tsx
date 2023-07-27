import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import IconEye from '@components/Icons/IconEye'
import IconDashedCircle from '@components/Icons/IconDashedCircle';

import Word from './Word';

import './Words.scss';

const WORDS = [
    // { word: 'drzewo', markers: { 2: { wordOrder: true }, 3: { wordOrder: true }, 5: { correct: true, right: true } } },
    // { word: 'krajobraz', markers: { 0: { correct: true, left: true }, 7: { correct: true } } },
    // { word: 'wodospad', markers: { 6: { correct: true, right: true }, 7: { correct: true, left: true } } },
    // { word: 'pies', markers: { 6: { correct: true, right: true }, 7: { correct: true, left: true } } },
];

const Words = ({ typedWord }) => {
  const guesses = useSelector((state) => state.game.guesses);
  const isProcessing = useSelector((state) => state.game.isProcessing);
  const wordToSubmit = useSelector((state) => state.game.wordToSubmit);

  const submitGuess = useMemo(() => {
    const affixes = (wordToSubmit || ' ').split('').map(letter => ({ type: 'new', text: letter }));

    return {
      affixes,
    };
  }, [wordToSubmit]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [wordToSubmit])

  console.log('guesses', guesses);

  return (
    <div className='words'>
        <IconEye className="icon-focus" />
        {guesses.map((guess, index) => {            
            return (
                <Word key={`guess-${index}`} guess={guess} />
            );
        })}
        {/* {submitedWords.map((word, index) => {            
            return (
                <Word key={`${word}-${index}`} word={word} />
            );
        })} */}
        <Word guess={submitGuess} />
        <If condition={isProcessing}>
          <p className="processing">
            <IconDashedCircle /> <span>sprawdzanie...</span>
          </p>
        </If>
    </div>
  )
};

export default Words;
