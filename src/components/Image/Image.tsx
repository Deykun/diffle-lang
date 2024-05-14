import clsx from 'clsx';
import { useState } from 'react';

import './Image.scss';

type Props = {
  className?: string,
  src: string,
  alt?: string
}

const Image = ({
  className,
  src,
  alt = '',
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = () => {
    setIsLoaded(true);
  };

  return (
      <img
        className={clsx('image', {
          [className || '']: className,
          'image--is-loaded': isLoaded,
        })}
        src={src}
        alt={alt}
        onLoad={onLoad}
      />
  );
};

export default Image;
