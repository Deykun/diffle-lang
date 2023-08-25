import React, { useCallback } from 'react';
import clsx from 'clsx';

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
}: Props) => {
    const Tag = tagName || 'button';

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        navigator?.vibrate(50);

        if (onClick) {
            onClick(event);
        }
    }, [onClick]);

    return (
        <Tag
          className={clsx('button', { 'inverted': isInverted, [className]: className, 'loading': isLoading })}
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
