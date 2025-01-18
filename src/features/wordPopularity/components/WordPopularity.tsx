import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { formatLargeNumber } from '@utils/format';

import { useSelector } from '@store';

import getWordPopularityPosition from '@features/wordPopularity/api/getWordPopularityPosition';

import './WordPopularity.scss';

type Props = {
  word: string,
};

const WordPopularity = ({ word }: Props) => {
  const gameLanguage = useSelector(state => state.game.language);

  const { t } = useTranslation();

  const {
    isLoading,
    // error,
    data: position,
  } = useQuery({
    queryFn: () => getWordPopularityPosition(word, gameLanguage || ''),
    queryKey: [`popularity-${gameLanguage}`, gameLanguage, word],
  });

  if (isLoading || !position || position === 0) {
    return null;
  }

  return (
      <p
        className="word-position-by-popularity"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: t('end.wordPopularityPosition', {
            position: formatLargeNumber(position),
          }),
        }}
      />
  );
};

export default WordPopularity;
