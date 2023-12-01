import clsx from 'clsx';

import { useSelector } from '@store';
import { selectLetterState } from '@store/selectors';
import { AffixStatus, Affix as AffixInterface } from '@common-types';

import './Affix.scss';

const Affix = ({ type, text, isStart, isEnd, hasCaretBefore, onClick }: AffixInterface) => {
    const keyCapType = useSelector(selectLetterState(text));
    const isKnownIncorrectTyped = type === AffixStatus.New && keyCapType === AffixStatus.Incorrect;

    return (
        <span
            className={clsx('affix', type, {
                'letter': text.length === 1,
                'known-incorect': isKnownIncorrectTyped,
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
