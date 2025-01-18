import { getNormalizedKey } from '../../../api/helpers';

type FetchedWordsListByKeys = {
  [key: string]: {
    [word: string]: number
  },
};

const cachedKeys: FetchedWordsListByKeys = {};

const getCacheKey = (lang: string, key: string) => `${lang}-${key}`;

export const getWordPopularityPosition = async (word: string, lang: string): Promise<number> => {
  const key = getNormalizedKey(word, lang);

  if (!key) {
    return 0;
  }

  const cacheKey = getCacheKey(lang, key);

  if (!cachedKeys[cacheKey]) {
    try {
      const response = await fetch(`./dictionary/${lang}/popularity/chunk-${key}.json`).catch((error) => {
        throw error;
      });

      if (response?.status === 404) {
        cachedKeys[cacheKey] = {};

        // No popularity positions for key
        return 0;
      }

      const result = await response.json();

      cachedKeys[cacheKey] = result;
    } catch (error) {
      // Error fetching
      return 0;
    }
  }

  const popularityPosition = cachedKeys[cacheKey][word] || 0;

  return popularityPosition;
};

export default getWordPopularityPosition;
