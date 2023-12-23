import clsx from 'clsx';
import { Word as WordInterface, AffixStatus } from '@common-types';

import { useDispatch } from '@store';
import { setCaretShift } from '@store/gameSlice';

import Affix from '@components/Words/Affix';

import './Words.scss';

const Word = ({ guess }: { guess: WordInterface }) => {
  const dispatch = useDispatch();

  const handleClickGenerator = (letterIndex: number) => () => {
    dispatch(setCaretShift(letterIndex));
  };

  if (!guess) {
    return null;
  }

  const length = guess.word.length;
  const indexWithCaretBefore = guess.caretShift !== undefined && guess.caretShift < 0 ? guess.word.length + guess.caretShift : undefined;

  return (
    <div className={clsx('word', { 'isExtraLong': length > 12 })}>
        {guess.affixes.map((
            {
                text,
                type,
                isStart,
                isEnd,
            },
                index
            ) => {
                const isNew = type === AffixStatus.New;
                const hasCaretBefore = index === indexWithCaretBefore;

                return (
                    <Affix
                      key={`${index}-${text}`}
                      text={text}
                      type={type}
                      isStart={isStart}
                      isEnd={isEnd}
                      hasCaretBefore={hasCaretBefore}
                      onClick={isNew ? handleClickGenerator(index) : undefined}
                    />
                );
            }
        )}
    </div>
  );
};

export default Word;
