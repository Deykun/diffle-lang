import clsx from 'clsx';
import { Word as WordType, AffixStatus } from '@common-types';

import { useDispatch } from '@store';
import { setCaretShift } from '@store/gameSlice';

import Affix from '@components/Words/Affix';

import './Words.scss';

const Word = ({ guess }: { guess: WordType }) => {
  const dispatch = useDispatch();

  const handleClickGenerator = (letterIndex: number) => () => {
    dispatch(setCaretShift(letterIndex));
  };

  if (!guess) {
    return null;
  }

  const { length } = guess.word;
  const indexWithCaretBefore = guess.caretShift !== undefined && guess.caretShift < 0 ? guess.word.length + guess.caretShift : undefined;

  return (
      <div
        className={clsx('word', {
          'word--is-long': length > 12,
          'word--is-extra-long': length > 15,
        })}
        data-testid={`word-${guess.word.replaceAll(' ', 'spacebar') || 'empty'}`}
      >
          {guess.affixes.map((
            {
              text,
              type,
              isStart,
              isEnd,
            },
            index,
          ) => {
            const isNew = type === AffixStatus.New;
            const hasCaretBefore = index === indexWithCaretBefore;

            return (
                <Affix
                  // eslint-disable-next-line react/no-array-index-key
                  key={`text-${index}`}
                  text={text}
                  type={type}
                  isStart={isStart}
                  isEnd={isEnd}
                  hasCaretBefore={hasCaretBefore}
                  onClick={isNew ? handleClickGenerator(index) : undefined}
                />
            );
          })}
      </div>
  );
};

export default Word;
