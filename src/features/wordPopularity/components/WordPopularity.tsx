import { useQuery } from '@tanstack/react-query';

import getWordPopularityPosition from '@api/getWordPopularityPosition';
import { useSelector, useDispatch } from '@store';

// import './GoToDictionaryButton.scss';

type Props = {
  word: string,
};

const WordPopularity = ({ word }: Props) => {
  // const dispatch = useDispatch();
  const gameLanguage = useSelector(state => state.game.language);

  const {
    isLoading,
    // error,
    data,
  } = useQuery({
    queryFn: () => getWordPopularityPosition(word, gameLanguage || ''),
    queryKey: [`popularity-${gameLanguage}`, gameLanguage, word],
  });

  if (isLoading || !data) {
    return null;
  }

  return (
      <p>
          dsd
          {data}
      </p>
  );
};

export default WordPopularity;
