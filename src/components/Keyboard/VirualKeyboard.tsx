import * as classNames from 'classnames';
import { useCallback } from 'react';
import IconBackspace from '../Icons/IconBackspace';

import UserKeyboardListner from './UserKeyboardListner';

import { KEYLINES } from './contants'

import './VirualKeyboard.scss';

interface Props {
    value: string,
}

const USED = ['a', 'd', 'e', 'k', 'o', 'z', 'h', 'c'];

const CORRECT = ['a', 'd', 'e', 'k', 'o', 'z'];

const WRONG_ORDER = ['e', 'z'];

const Keyboard = ({ value, setValue }: Props ) => {
    const handleTyped = useCallback((key: string) => {
        if (key === 'backspace') {
            setValue(value => value.slice(0, -1))

            return;
        }

        if (key === 'enter') {
            // TODO submit

            return;
        }

        setValue(value => value + key);
    }, [setValue]);

    return (
        <>
            <UserKeyboardListner typeAction={handleTyped} />
            <aside className="keyboard">
                {KEYLINES.map((line, index) => {
                    return (
                        <div className="line">
                            {line.map((key) => {
                                return (<button
                                    key={`letter-${key}-${index}`}
                                    onClick={() => handleTyped(key)}
                                    className={classNames('key', {
                                        'key-used': USED.includes(key),
                                        'key-correct': CORRECT.includes(key),
                                        'key-wrong-order': WRONG_ORDER.includes(key),
                                    })}>
                                        {key === 'backspace' ? <IconBackspace /> : key}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </aside>
        </>
    )
};

export default Keyboard;
