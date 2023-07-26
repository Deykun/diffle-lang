import clsx from 'clsx';

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconBackspace from '@components/Icons/IconBackspace';

import { submitAnswer, letterChangeInAnswer } from '@store/gameSlice';

import { KEY_LINES, ALLOWED_KEYS } from '@const';

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
    } else if (isTyped) {
        type = 'new';
    }

    return (
        <button
            onClick={onClick}
            className={clsx('key', type)}>
                {text === 'backspace' ? <IconBackspace /> : text}
        </button>
    );
};

export default KeyCap;
