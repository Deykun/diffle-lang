import clsx from 'clsx';

import './IconAnimatedCaret.scss';

type Props = {
  className?: string,
  isOpen?: boolean,
};

const IconAnimatedCaret = ({ className, isOpen = false }: Props) => (
    <i className={clsx('icon-animated-caret', className, { 'icon-animated-caret--open': isOpen })} />
);

export default IconAnimatedCaret;
