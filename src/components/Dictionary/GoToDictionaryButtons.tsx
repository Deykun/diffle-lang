import { useState } from 'react';
// import clsx from 'clsx';
import Button from '@components/Button/Button';
import GoToDictionaryButton from '@components/Dictionary/GoToDictionaryButton';

// import './CircleScale.scss';

type Props = {
  words: string[],
};

const GoToDictionaryButtons = ({
  words,
}: Props) => {
  const [index, setIndex] = useState(words.length - 1);

  if (words.length === 0) {
    return null;
  }

  if (words.length === 1) {
    return (<GoToDictionaryButton word={words[0]} />);
  }

  return (
      <div>
          <Button
            onClick={() => setIndex(index - 1)}
            isDisabled={index === 0}
            isInverted
            isText
            hasBorder={false}
          >
              {'<'}
          </Button>
          <GoToDictionaryButton word={words[index]} />
          <Button
            onClick={() => setIndex(index + 1)}
            isDisabled={index === (words.length - 1)}
            isInverted
            isText
            hasBorder={false}
          >
              {'>'}
          </Button>
      </div>
  );
};

export default GoToDictionaryButtons;
