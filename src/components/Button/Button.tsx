import React, { useCallback } from 'react';
import clsx from 'clsx';

import { useSelector } from '@store';

import IconLoader from '@components/Icons/IconLoader';

import './Button.scss';

interface Props {
    tagName?: ('button' | 'a')
    className?: string,
    children: React.ReactNode,
    onClick?: (e: React.MouseEvent<HTMLElement>) => void,
    href?: string,
    target?: string,
    isLoading?: boolean,
    isInverted?: boolean,
    isLarge?: boolean,
}

const Button = ({
    className = '',
    tagName,
    children,
    onClick,
    href,
    target,
    isLoading = false,
    isInverted = false,
    isLarge = false,
}: Props) => {
    const Tag = tagName || 'button';
    const shouldVibrate = useSelector(state => state.app.shouldVibrate);

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        if (shouldVibrate) {
            navigator?.vibrate(50);
        }

        if (onClick) {
            onClick(event);
        }
    }, [onClick, shouldVibrate]);

    return (
        <Tag
          className={clsx('button', { 'inverted': isInverted, 'large': isLarge, [className]: className, 'loading': isLoading })}
          onClick={handleClick}
          href={href}
          target={target}
        >
            {isLoading && <IconLoader className="button-loader" />}
            {children}
        </Tag>
    )
};

export default Button;
