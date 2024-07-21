import { useState } from 'react';
// import clsx from 'clsx';
import IconAnimatedArrow from '@components/Icons/IconAnimatedArrow';

import Button from '@components/Button/Button';
import GoToDictionaryButton from '@components/Dictionary/GoToDictionaryButton';

import './GoToDictionaryButtons.scss';

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
      <>
          <GoToDictionaryButton word={words[index]} />
          <div className="go-to-dictionary-buttons">
              <Button
                className="go-to-dictionary-buttons-arrow"
                onClick={() => setIndex(index - 1)}
                isDisabled={index === 0}
                isInverted
                isText
                hasBorder={false}
              >
                  <IconAnimatedArrow direction="left" />
              </Button>
              <Button
                className="go-to-dictionary-buttons-arrow"
                onClick={() => setIndex(index + 1)}
                isDisabled={index === (words.length - 1)}
                isInverted
                isText
                hasBorder={false}
              >
                  <IconAnimatedArrow direction="right" />
              </Button>
          </div>
      </>
  );
};

export default GoToDictionaryButtons;
