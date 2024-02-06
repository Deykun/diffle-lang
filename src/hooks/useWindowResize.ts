// https://gist.github.com/ivanstnsk/c3ba1edf00d07fab9afa3f61a95193a8

import { useEffect, useState } from 'react';

type TWindowSize = [number, number];

type THook = TWindowSize;

export const useWindowResize = (): THook => {
  const initSize: TWindowSize = [
    window.innerWidth,
    window.innerHeight,
  ];
  const [windowSize, setWindowSize] = useState<TWindowSize>(initSize);

  useEffect(() => {
    const handleResize = (): void => {
      setWindowSize([
        window.innerWidth,
        window.innerHeight,
      ]);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};

// Example of usage
// const [width, height] = useWindowResize();    