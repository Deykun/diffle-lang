import clsx from 'clsx';

import Affix from '@components/Words/Affix';

import './Words.scss';

interface Props {
    word: string,
    isNew: boolean,
}

const Word = ({ word = '', isNew = false }: Props) => {
  const turnToLetters = isNew && word === '' ? ' ' : word;

  return (
    <p className="word">
        {Array.from(turnToLetters).map((text, textIndex) => {
            // const { correct, left, right, wordOrder } = markers[letterIndex] || {};
            const { correct, left, right, wordOrder } = {};

            return (
                <Affix key={`${text}-${textIndex}`} text={text} type={isNew ? 'new' : 'incorrect'} />
            );
        })}
    </p>
  )
};

export default Word;
