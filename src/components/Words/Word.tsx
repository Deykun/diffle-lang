import classNames from 'clsx';

import Affix from '@components/Words/Affix';

import './Words.scss';

interface Props {
    // guess: boolean,
}

const Word = ({ guess }: Props) => {
  if (!guess) {
    return null;
  }

  return (
    <p className="word">
        {guess.affixes.map(({ text, type, isStart, isEnd }, index) => {
            return (
                <Affix key={`${index}-${text}`} text={text} type={type} isStart={isStart} isEnd={isEnd} />
            );
        })}
    </p>
  );
};

export default Word;
