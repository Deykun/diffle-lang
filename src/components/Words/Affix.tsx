import clsx from 'clsx';

import { Affix as AffixInterface } from '@common-types';

import './Affix.scss';

const Affix = ({ type, text, isStart, isEnd, hasCaretBefore }: AffixInterface) => {
    return (
        <span
            className={clsx('affix', type, {
                'letter': text.length === 1,
                'start': isStart,
                'end': isEnd,
                'caret': hasCaretBefore,
            })}
        >
            {text}
        </span>
    );
};

export default Affix;
