import React, { useCallback } from 'react';
import clsx from 'clsx';

import useVibrate from '@hooks/useVibrate';

import IconLoader from '@components/Icons/IconLoader';

import './ButtonTile.scss';

interface Props {
  tagName?: ('button' | 'a')
  className?: string,
  children: React.ReactNode,
  onClick?: (e: React.MouseEvent<HTMLElement>) => void,
  href?: string,
  title?: string,
  target?: string,
  rel?: string,
  isActive?: boolean,
  isDisabled?: boolean,
  isLoading?: boolean,
  isInverted?: boolean,
  dataTestId?: string,
}

const ButtonTile = ({
  className = '',
  tagName,
  children,
  onClick,
  href,
  title,
  target,
  rel,
  isActive = false,
  isDisabled = false,
  isLoading = false,
  isInverted = false,
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
        className={clsx('button-tile', {
          'button-tile-active': isActive,
          'button-tile-inverse': isInverted,
          // isActive
          // inverted: isInverted,
          // text: isText,
          // large: isLarge,
          [className]: className,
          // loading: isLoading,
          // 'no-border': !hasBorder,
        })}
        onClick={handleClick}
        href={href}
        title={title}
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

export default ButtonTile;
