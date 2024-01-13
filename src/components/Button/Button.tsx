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
    isText?: boolean,
    isLarge?: boolean,
    hasBorder?: boolean,
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
    isText = false,
    isLarge = false,
    hasBorder = true,
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
          className={clsx('button', {
            'inverted': isInverted,
            'text': isText,
            'large': isLarge,
            [className]: className,
            'loading': isLoading,
            'no-border': !hasBorder,
          })}
          onClick={handleClick}
          href={href}
          rel={rel}
          target={target}
        >
            {children}
            {isLoading && <IconLoader className="button-loader" />}
        </Tag>
    )
};

export default Button;
