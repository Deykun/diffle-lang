import clsx from 'clsx';

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconBackspace from '@components/Icons/IconBackspace';

import { submitAnswer, letterChangeInAnswer } from '@store/gameSlice';

import { KEY_LINES, ALLOWED_KEYS } from '@const';

import './KeyCap.scss';

const KeyCap = ({ text, onClick }) => {
    const isUsed = useSelector(state => state.game.usedLetters[text]);

    const type = isUsed ? 'used' : 'unused';

    return (
        <button
            onClick={onClick}
            className={clsx('key', type)}>
                {text === 'backspace' ? <IconBackspace /> : text}
        </button>
    );
};

export default KeyCap;
