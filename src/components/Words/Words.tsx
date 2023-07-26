import clsx from 'clsx';
import { useSelector } from 'react-redux';

import Word from './Word';

import './Words.scss';

const WORDS = [
    // { word: 'drzewo', markers: { 2: { wordOrder: true }, 3: { wordOrder: true }, 5: { correct: true, right: true } } },
    // { word: 'krajobraz', markers: { 0: { correct: true, left: true }, 7: { correct: true } } },
    // { word: 'wodospad', markers: { 6: { correct: true, right: true }, 7: { correct: true, left: true } } },
    // { word: 'pies', markers: { 6: { correct: true, right: true }, 7: { correct: true, left: true } } },
];

const Words = ({ typedWord }) => {
  const submitedWords = useSelector((state) => state.game.submited);
  const wordToSubmit = useSelector((state) => state.game.wordToSubmit);

  return (
    <div>
        {submitedWords.map((word, index) => {            
            return (
                <Word key={word} word={word} />
            );
        })}
        <Word word={wordToSubmit} isNew />
    </div>
  )
};

export default Words;
