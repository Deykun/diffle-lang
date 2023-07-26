import clsx from 'clsx';

import './Affix.scss';

interface Props {
    text: string,
    type: ('new' | 'correct' | 'position' | 'incorrect'),
    isIncorect: boolean,
    isStart: boolean,
    isEnd: boolean,
}

const Affix = ({ type, text, isStart, isEnd }: Props) => {

  return (
        <span
            className={clsx('affix', type, {
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
