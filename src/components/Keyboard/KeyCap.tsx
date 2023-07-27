import classNames from 'clsx';

import { useSelector } from 'react-redux';

import IconBackspace from '@components/Icons/IconBackspace';

import './KeyCap.scss';

const KeyCap = ({ text, onClick }) => {
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

    return (
        <button
            onClick={onClick}
            className={classNames('key', `key-${text}`, type, { 'typed': isTyped })}>
                {text === 'backspace' ? <IconBackspace /> : text}
        </button>
    );
};

export default KeyCap;
