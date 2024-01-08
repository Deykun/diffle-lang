import { useEffect } from 'react';

export default function useScrollEffect(to: ('top' | 'bottom'), args: (string | boolean | object | undefined)[]) {
    useEffect(() => {
        setTimeout(() => {
            if (to === 'top') {
                window.scrollTo(0, 0);
            } else if (to === 'bottom') {
                window.scrollTo(0, document.body.scrollHeight);
            }
        }, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, args);
}
