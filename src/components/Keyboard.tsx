import * as classNames from 'classnames';
import IconBackspace from './Icons/IconBackspace';

import './Keyboard.scss';

const KEYLINES = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'delete'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
    ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
];

const USED = ['a', 'd', 'e', 'k', 'o', 'z', 'h', 'c'];

const CORRECT = ['a', 'd', 'e', 'k', 'o', 'z'];

const WRONG_ORDER = ['e', 'z'];

const Keyboard = () => {
    return (
        <aside className="keyboard">
            {KEYLINES.map((line, index) => {
                return (
                    <div className="line">
                        {line.map((key) => {
                            return (<button
                                key={`letter-${key}-${index}`}
                                className={classNames('key', {
                                    'key-used': USED.includes(key),
                                    'key-correct': CORRECT.includes(key),
                                    'key-wrong-order': WRONG_ORDER.includes(key),
                                })}>
                                    {key === 'delete' ? <IconBackspace /> : key}
                                </button>
                            );
                        })}
                    </div>
                );
            })}
        </aside>
    )
};

export default Keyboard;
