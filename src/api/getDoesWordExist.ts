import { getNormalizedKey } from './helpers';

type FetchedWordsListByKeys = {
  [key: string]: string[]
};

export const DoesWordExistErrorTypes = {
  TooShort: 'too_short',
  Fetch: 'fetch',
} as const;

type DoesWordExistErrorType = typeof DoesWordExistErrorTypes[keyof typeof DoesWordExistErrorTypes];

type GetDoesWordExistReport = {
  doesWordExist: boolean,
  isError: boolean,
  errorType?: DoesWordExistErrorType
};

const cachedKeys: FetchedWordsListByKeys = {};

const getCacheKey = (lang: string, key: string) => `${lang}-${key}`;

export const getDoesWordExist = async (word: string, lang: string): Promise<GetDoesWordExistReport> => {
  const key = getNormalizedKey(word, lang);

  if (!key) {
    return {
      doesWordExist: false,
      isError: true,
      errorType: DoesWordExistErrorTypes.TooShort,
    };
  }

  const cacheKey = getCacheKey(lang, key);

  if (!cachedKeys[cacheKey]) {
    try {
      const response = await fetch(`./dictionary/${lang}/spelling/chunk-${key}.json`).catch((error) => {
        throw error;
      });

      if (response?.status === 404) {
        cachedKeys[cacheKey] = [];

        return {
          doesWordExist: false,
          isError: false,
        };
      }

      const result = await response.json();

      cachedKeys[cacheKey] = result;
    } catch (error) {
      return {
        doesWordExist: false,
        isError: true,
        errorType: DoesWordExistErrorTypes.Fetch,
      };
    }
  }

  const doesWordExist = cachedKeys[cacheKey].includes(word);

  return {
    doesWordExist,
    isError: false,
  };
};

type KeyWithIndex = {
  key: string,
  index: number,
};

export const getWordsFromKeysWithIndexes = async (keysWithIndexes: KeyWithIndex[], lang: string): Promise<string[]> => {
  const words = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const keyWithIndex of keysWithIndexes) {
    const { key, index } = keyWithIndex;

    const cacheKey = getCacheKey(lang, key);

    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(`./dictionary/${lang}/spelling/chunk-${key}.json`).catch((error) => {
        throw error;
      });

      if (response?.status === 404) {
        cachedKeys[cacheKey] = [];
      }

      // eslint-disable-next-line no-await-in-loop
      const result = await response.json();

      cachedKeys[cacheKey] = result;
    } catch (error) {
      //
    }

    const word = cachedKeys[cacheKey][index];

    if (word) {
      words.push(word);
    }
  }

  return words;
};

export const getWordsIndexesChunks = (words: string[], lang: string) => {
  const keysWithWords = words.map(word => ({ word, key: getNormalizedKey(word, lang) }));
  const hasAllWordsFetched = keysWithWords.every(
    ({ word, key }) => {
      if (!key) {
        return false;
      }

      const cacheKey = getCacheKey(lang, key);

      return Array.isArray(cachedKeys[cacheKey]) && cachedKeys[cacheKey].includes(word);
    },
  );

  if (!hasAllWordsFetched) {
    return [];
  }

  return keysWithWords.map(({ word, key }) => {
    const cacheKey = getCacheKey(lang, key);

    return {
      word,
      key,
      index: cachedKeys && cachedKeys[cacheKey] ? cachedKeys[cacheKey].findIndex(keyWords => word === keyWords) : -1,
    };
  });
};

export default getDoesWordExist;
