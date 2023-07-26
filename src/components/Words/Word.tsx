import clsx from 'clsx';

import Affix from '@components/Words/Affix';

import './Words.scss';

interface Props {
    word: string,
    isNew: boolean,
}

const Word = ({ word = '', guess }: Props) => {
  // let affixes = !guess ? [{ type: 'new', text: word || ' ' }] : guess.affixes;

    // console.log(guess);

  // if (guess) {
  //   affixes = guess.affixes;
  // }
  // guess

  console.log(guess);

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
  )
};

export default Word;
