import * as classNames from 'classnames';
import { useCallback, useEffect, useRef } from 'react';
import IconBackspace from '../Icons/IconBackspace';

import { ALLOWED_KEYS } from './contants'

import './VirualKeyboard.scss';

interface Props {
    typeAction: (value: string) => {},
}

const UserKeyboardListner = ({ typeAction }: Props ) => {
    const listnerRef = useRef(null);


    useEffect(() => {
        if (!listnerRef.current) {
            listnerRef.current = (event: React.KeyboardEvent<HTMLDivElement>) => {
                const keyTyped = (event?.key || '').toLowerCase();

                const isAllowedKey = ALLOWED_KEYS.includes(keyTyped);

                console.log('keyTyped', keyTyped);

                if (isAllowedKey) {
                    typeAction(keyTyped)
                }
            };

            document.addEventListener('keydown', listnerRef.current);
        }

        () => {
            if (listnerRef.current) {
                document.removeEventListener('keydown', listnerRef.current);
            }
        }
    }, [typeAction])

    return null;
};

export default UserKeyboardListner;
