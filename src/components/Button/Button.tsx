import React, { useCallback } from 'react';
import clsx from 'clsx';

import useVibrate from '@hooks/useVibrate';

import IconLoader from '@components/Icons/IconLoader';

import './Button.scss';

type Props = {
  tagName?: ('button' | 'a')
  className?: string,
  children: React.ReactNode,
  onClick?: (e: React.MouseEvent<HTMLElement>) => void,
  href?: string,
  target?: string,
  rel?: string,
  isDisabled?: boolean,
  isLoading?: boolean,
  isInverted?: boolean,
  isText?: boolean,
  isLarge?: boolean,
  hasBorder?: boolean,
  dataTestId?: string,
};

const Button = ({
  className = '',
  tagName,
  children,
  onClick,
  href,
  target,
  rel,
  isDisabled = false,
  isLoading = false,
  isInverted = false,
  isText = false,
  isLarge = false,
  hasBorder = true,
  dataTestId,
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
          inverted: isInverted,
          text: isText,
          large: isLarge,
          [className]: className,
          loading: isLoading,
          'no-border': !hasBorder,
        })}
        onClick={handleClick}
        href={href}
        rel={rel}
        target={target}
        disabled={isDisabled}
        data-testid={dataTestId}
      >
          {children}
          {isLoading && <IconLoader className="button-loader" />}
      </Tag>
  );
};

export default Button;
