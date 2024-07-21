import clsx from 'clsx';
import './IconAnimatedArrow.scss';

type Props = {
  className?: string,
  direction: 'left' | 'right',
};

const IconAnimatedArrowLeft = ({ className, direction }: Props) => (
    <i className={clsx('icon-animated-arrow', `icon-animated-arrow--${direction}`, className)} />
);

export default IconAnimatedArrowLeft;
