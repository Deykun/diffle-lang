import classNames from 'classnames';

import './Words.scss';

interface Props {
    word: string,
}

const Words = ({ word = '' }: Props) => {
  return (
    <p className="word">
        {Array.from(word).map((letter, letterIndex) => {
            // const { correct, left, right, wordOrder } = markers[letterIndex] || {};
            const { correct, left, right, wordOrder } = {};

            return (
                <span
                    key={letterIndex}
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
  )
};

export default Words;
