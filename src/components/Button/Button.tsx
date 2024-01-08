import React, { useCallback } from 'react';
import clsx from 'clsx';

import useVibrate from '@hooks/useVibrate';

import IconLoader from '@components/Icons/IconLoader';

import './Button.scss';

interface Props {
    tagName?: ('button' | 'a')
    className?: string,
    children: React.ReactNode,
    onClick?: (e: React.MouseEvent<HTMLElement>) => void,
    href?: string,
    target?: string,
    rel?: string,
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
    rel,
    isLoading = false,
    isInverted = false,
    isLarge = false,
}: Props) => {
    const Tag = tagName || 'button';

    const { vibrate } = useVibrate();

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        vibrate();

        if (onClick) {
            onClick(event);
        }
    }, [onClick, vibrate]);

    return (
        <Tag
          className={clsx('button', { 'inverted': isInverted, 'large': isLarge, [className]: className, 'loading': isLoading })}
          onClick={handleClick}
          href={href}
          rel={rel}
          target={target}
        >
            {isLoading && <IconLoader className="button-loader" />}
            {children}
        </Tag>
    )
};

export default Button;
