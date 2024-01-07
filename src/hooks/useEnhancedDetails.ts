import { useRef, useCallback } from 'react';

// HTML Details is shitty and closing animation isn't possible without hacks
export default function useEnhancedDetails() {
    const setTimeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleClickSummary = useCallback((event: React.MouseEvent<HTMLElement>) => {
        if (!(event.target instanceof HTMLElement)) {
            return;
        }

        const detailsElement = event.target.closest('details');

        if (!detailsElement) {
            return;
        }

        const isOpen = detailsElement.hasAttribute('open');

        if (isOpen) {
            if (setTimeoutRef.current) {
                clearTimeout(setTimeoutRef.current);
            }
              
            const isClosingAndShouldStop = detailsElement.classList.contains('is-closing');

            if (isClosingAndShouldStop) {
                detailsElement.classList.remove('is-closing');

                return;
            }

            detailsElement.classList.add('is-closing');
            event.preventDefault();

            setTimeoutRef.current = setTimeout(() => {
                try {
                    detailsElement.removeAttribute('open');
                    detailsElement.classList.remove('is-closing');
                } catch {
                    // Probably unmounted
                }
            }, 150);
        }
    }, []);

    return {
        handleClickSummary,
    }
}
