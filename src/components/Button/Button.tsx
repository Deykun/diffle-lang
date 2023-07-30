import React from 'react';
import clsx from 'clsx';

import './Button.scss';

interface Props {
    tagName?: ('button' | 'a')
    className?: string,
    children: React.ReactNode,
    onClick?: (e: React.MouseEvent<HTMLElement>) => void,
    href?: string,
    target?: string,
    isInverted?: boolean,
}

const Button = ({
    className = '',
    tagName,
    children,
    onClick,
    href,
    target,
    isInverted = false,
}: Props) => {
    const Tag = tagName || 'button';

    return (
        <Tag
          className={clsx('button', { 'inverted': isInverted, [className]: className })}
          onClick={onClick}
          href={href}
          target={target}
        >
            {children}
        </Tag>
    )
};

export default Button;
