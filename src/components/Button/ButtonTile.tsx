import React, { useCallback } from 'react';
import clsx from 'clsx';
import { Link } from 'wouter';

import useVibrate from '@hooks/useVibrate';

import IconLoader from '@components/Icons/IconLoader';

import './ButtonTile.scss';

type Props = {
  tagName?: 'button' | 'a' | 'link',
  variant?: 'small' | '',
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
};

const ButtonTile = ({
  className = '',
  tagName,
  variant = '',
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
  let Tag: string | typeof Link = 'button';
  if (tagName) {
    Tag = tagName === 'link' ? Link : 'a';
  }

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
          [className]: className,
          [`button-tile-${variant}`]: variant,
        })}
        onClick={handleClick}
        href={href}
        title={title}
        rel={rel}
        target={target}
        // @ts-expect-error wouter Link doesn't support it
        disabled={tagName !== 'link' ? isDisabled : undefined}
        data-testid={dataTestId}
      >
          {children}
          {isLoading && <IconLoader className="button-loader" />}
      </Tag>
  );
};

export default ButtonTile;
