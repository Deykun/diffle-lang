import clsx from 'clsx';

import { Affix as AffixInterface } from '@common-types';

import './Affix.scss';

const Affix = ({ type, text, isStart, isEnd, hasCaretBefore, onClick }: AffixInterface) => {
    return (
        <span
            className={clsx('affix', type, {
                'letter': text.length === 1,
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
