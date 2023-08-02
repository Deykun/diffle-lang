import clsx from 'clsx';

import { useSelector } from '@store';

import IconBackspace from '@components/Icons/IconBackspace';
import IconCheckEnter from '@components/Icons/IconCheckEnter';


import './KeyCap.scss';

interface Props {
    text: string,
    onClick: (event: React.MouseEvent<HTMLElement>) => void,
}

const KeyCap = ({ text, onClick }: Props) => {
    const isCorrect = useSelector(state => state.game.letters.correct[text]);
    const isIncorrect = useSelector(state => state.game.letters.incorrect[text]);
    const isPosition = useSelector(state => state.game.letters.position[text]);
    const wordToSubmit = useSelector((state) => state.game.wordToSubmit);
    const isTyped = wordToSubmit.includes(text);

    let type = 'unused';

    if (isCorrect) {
        type = 'correct';
    } else if (isPosition) {
        type = 'position';
    } else if (isIncorrect) {
        type = 'incorrect';
    }

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
