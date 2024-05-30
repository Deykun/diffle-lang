import { useMemo } from 'react';
import clsx from 'clsx';

import { useSelector } from '@store';
import { selectWordToSubmit, selectLetterState, selectKeyboardState } from '@store/selectors';
import { AffixStatus, Affix as AffixType } from '@common-types';

import './Affix.scss';

const Affix = ({
  type, text, isStart, isEnd, hasCaretBefore, onClick, isSubmitted = false,
}: AffixType) => {
  const wordToSubmit = useSelector(selectWordToSubmit);
  const keyCapType = useSelector(selectLetterState(text));
  const { status: keyboardState } = useSelector(selectKeyboardState);
  const flatAffixes = useSelector(state => state.game.flatAffixes);

  const isKnownIncorrectTyped = keyCapType === AffixStatus.Incorrect;
  const isKnownTypedTooMuch = keyCapType === AffixStatus.IncorrectOccurance;

  const isKnownMissingAffix = useMemo(() => {
    if (!isSubmitted) {
      return false;
    }

    if (keyboardState === AffixStatus.IncorrectStart && isStart) {
      return true;
    }

    if (keyboardState === AffixStatus.IncorrectEnd && isEnd) {
      return true;
    }

    if (text.length < 2) {
      return false;
    }

    if (keyboardState === AffixStatus.IncorrectMiddle) {
      const missingAffixes = flatAffixes.middle.filter(flatAffix => !wordToSubmit.includes(flatAffix));
      const isOneOfMissingAffixes = missingAffixes.some(
        missingFlatAffix => missingFlatAffix.includes(text) && !wordToSubmit.includes(text),
      );

      console.log({
        missingAffixes,
        isOneOfMissingAffixes,
        text,
      });

      if (isOneOfMissingAffixes) {
        return true;
      }
    }

    return false;
  }, [isSubmitted, keyboardState, isStart, isEnd, text, flatAffixes.middle, wordToSubmit]);

  return (
      <span // eslint-disable-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        className={clsx('affix', type, {
          letter: text.length === 1,
          'known-incorect': isKnownIncorrectTyped,
          'known-typed-too-much': isKnownTypedTooMuch,
          'known-missing-part': isKnownMissingAffix,
          start: isStart,
          end: isEnd,
          caret: hasCaretBefore,
        })}
        data-testid={`affix-${text.replaceAll(' ', 'spacebar')}`}
        onClick={onClick}
      >
          {/* Both text-transform: uppercase and .toUppercase() replace ß with SS */}
          {text.replace('ß', 'ẞ')}
      </span>
  );
};

export default Affix;
