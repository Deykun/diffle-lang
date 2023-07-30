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
}

const Button = ({
    className = '',
    tagName,
    children,
    onClick,
    href,
    target,
}: Props) => {
    const Tag = tagName || 'button';

    return (
        <Tag
          className={clsx('button', { [className]: className })}
          onClick={onClick}
          href={href}
          target={target}
        >
            {children}
        </Tag>
    )
};

export default Button;
