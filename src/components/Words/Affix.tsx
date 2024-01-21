import clsx from 'clsx';

import { useSelector } from '@store';
import { selectLetterState } from '@store/selectors';
import { AffixStatus, Affix as AffixInterface } from '@common-types';

import './Affix.scss';

const Affix = ({ type, text, isStart, isEnd, hasCaretBefore, onClick }: AffixInterface) => {
    const keyCapType = useSelector(selectLetterState(text));
    // const isKnownIncorrectTyped = type === AffixStatus.New && keyCapType === AffixStatus.Incorrect;
    const isKnownIncorrectTyped = keyCapType === AffixStatus.Incorrect;
    const isKnownTypedTooMuch = keyCapType === AffixStatus.IncorrectOccurance;

    return (
        <span
            className={clsx('affix', type, {
                'letter': text.length === 1,
                'known-incorect': isKnownIncorrectTyped,
                'known-typed-too-much': isKnownTypedTooMuch,
                'start': isStart,
                'end': isEnd,
                'caret': hasCaretBefore,
            })}
            onClick={onClick}
        >
            {text}
        </span>
    );
};

export default Affix;
