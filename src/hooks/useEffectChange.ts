import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useEffectChange(callback: () => void, args: (any)[] ) {
    const isInited = useRef(false);

    useEffect(() => {
        if (!isInited.current) {
            isInited.current = true;

            return;
        }

        return callback();
    }, args); // eslint-disable-line react-hooks/exhaustive-deps
}
