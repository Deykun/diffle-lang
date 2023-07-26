import classNames from 'classnames';
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
  const wordToSubmit = useSelector((state) => state.game.wordToSubmit);

  return (
    <div>
        {WORDS.map(({ word, markers }, index) => {
            const key = `${word}-${index}`;
            
            return (
                <p key={key} className="word">
                    {Array.from(word).map((letter, letterIndex) => {
                        const { correct, left, right, wordOrder } = markers[letterIndex] || {};

                        return (
                            <span
                              key={`${key}-${letterIndex}`}
                              className={classNames('letter', {
                                'letter-correct': correct,
                                'letter-left': left,
                                'letter-right': right,
                                'letter-wrong-order': wordOrder,
                              })}
                            >
                                {letter}
                            </span>
                        );
                    })}
                </p>
            );
        })}
        <Word word={wordToSubmit} />
    </div>
  )
};

export default Words;
