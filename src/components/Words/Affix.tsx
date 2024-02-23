import clsx from 'clsx';

import { useSelector } from '@store';
import { selectLetterState } from '@store/selectors';
import { AffixStatus, Affix as AffixInterface } from '@common-types';

import './Affix.scss';

const Affix = ({
  type, text, isStart, isEnd, hasCaretBefore, onClick,
}: AffixInterface) => {
  const keyCapType = useSelector(selectLetterState(text));

  const isKnownIncorrectTyped = keyCapType === AffixStatus.Incorrect;
  const isKnownTypedTooMuch = keyCapType === AffixStatus.IncorrectOccurance;

  return (
      <span // eslint-disable-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        className={clsx('affix', type, {
          letter: text.length === 1,
          'known-incorect': isKnownIncorrectTyped,
          'known-typed-too-much': isKnownTypedTooMuch,
          start: isStart,
          end: isEnd,
          caret: hasCaretBefore,
        })}
        onClick={onClick}
      >
          {/* Both text-transform: uppercase and .toUppercase() replace ß with SS */}
          {text.replace('ß', 'ẞ')}
      </span>
  );
};

export default Affix;
