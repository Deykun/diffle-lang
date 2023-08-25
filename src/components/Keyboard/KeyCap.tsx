import clsx from 'clsx';

import { useSelector } from '@store';
import { selectLetterState, selectWordToSubmit } from '@store/selectors';

import IconBackspace from '@components/Icons/IconBackspace';
import IconCheckEnter from '@components/Icons/IconCheckEnter';

import './KeyCap.scss';

interface Props {
    text: string,
    onClick: (event: React.MouseEvent<HTMLElement>) => void,
}

const KeyCap = ({ text, onClick }: Props) => {
    const type = useSelector(selectLetterState(text));
    const wordToSubmit = useSelector(selectWordToSubmit);

    const isTyped = wordToSubmit.includes(text);

    const shouldUseIcon = text === 'backspace' || text === 'enter';

    return (
        <button
            onClick={onClick}
            className={clsx('key', `key-${text}`, type, { 'typed': isTyped })}>
                {shouldUseIcon && text ==='backspace' && <IconBackspace />}
                {shouldUseIcon && text ==='enter' && <IconCheckEnter />}
                {!shouldUseIcon && text}
        </button>
    );
};

export default KeyCap;
