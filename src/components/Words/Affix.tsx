import classNames from 'clsx';

import { Affix as AffixInterface } from '@common-types';

import './Affix.scss';

const Affix = ({ type, text, isStart, isEnd }: AffixInterface) => {
  return (
        <span
            className={classNames('affix', type, {
                'letter': text.length === 1,
                'start': isStart,
                'end': isEnd,
            })}
        >
            {text}
        </span>
    );
};

export default Affix;
