import clsx from 'clsx';
import { Word as WordInterface } from '@common-types';

import Affix from '@components/Words/Affix';

import './Words.scss';

const Word = ({ guess }: { guess: WordInterface }) => {
  if (!guess) {
    return null;
  }

  const length = guess.word.length;
  const indexWithCaretBefore = guess.caretShift !== undefined && guess.caretShift < 0 ? guess.word.length + guess.caretShift : undefined;

  return (
    <p className={clsx('word', { 'isExtraLong': length > 12 })}>
        {guess.affixes.map((
            {
                text,
                type,
                isStart,
                isEnd,
            },
                index
            ) => {
                const hasCaretBefore = index === indexWithCaretBefore;

                return (
                    <Affix
                      key={`${index}-${text}`}
                      text={text}
                      type={type}
                      isStart={isStart}
                      isEnd={isEnd}
                      hasCaretBefore={hasCaretBefore}
                    />
                );
            }
        )}
    </p>
  );
};

export default Word;
