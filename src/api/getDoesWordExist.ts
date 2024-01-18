import { getNormalizedKey } from './helpers';

type fetchedWordsListByKeys = {
    [key: string]: string[]
}

export enum DoesWordExistErrorType {
    TooShort = 'too_short',
    Fetch = 'fetch',
}

type getDoesWordExistReport = {
    doesWordExist: boolean,
    isError: boolean,
    errorType?: DoesWordExistErrorType,
}

const cachedKeys: fetchedWordsListByKeys = {};

const getCacheKey = (lang: string, key: string) => `${lang}-${key}`;

export const getDoesWordExist = async (word: string, lang: string): Promise<getDoesWordExistReport> => {
    const key = getNormalizedKey(word, lang);

    if (!key) {
        return {
            doesWordExist: false,
            isError: true,
            errorType: DoesWordExistErrorType.TooShort,
        };
    }

    const cacheKey = getCacheKey(lang, key);

    if (!cachedKeys[cacheKey]) {
        try {
            const response = await fetch(`./dictionary/${lang}/spelling/chunk-${key}.json`).catch(error => {
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
                errorType: DoesWordExistErrorType.Fetch,
            };
        }
    }

    const doesWordExist = cachedKeys[cacheKey].includes(word);

    return {
        doesWordExist,
        isError: false,
    };
};

interface KeyWithIndex {
    key: string,
    index: number,
}

export const getWordsFromKeysWithIndexes = async (keysWithIndexes: KeyWithIndex[], lang: string): Promise<string[]> => {
    const words = [];

    for (const keyWithIndex of keysWithIndexes) {
        const { key, index } = keyWithIndex;

        const cacheKey = getCacheKey(lang, key);

        try {
            const response = await fetch(`./dictionary/${lang}/spelling/chunk-${key}.json`).catch(error => {
                throw error;
            });

            if (response?.status === 404) {
                cachedKeys[cacheKey] = [];
            }

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
    const keysWithWords = words.map((word) => ({ word, key: getNormalizedKey(word, lang) }));
    const hasAllWordsFetched = keysWithWords.every(
        ({ word, key }) => {
            if (!key) {
                return false;
            }

            const cacheKey = getCacheKey(lang, key);
            
            return Array.isArray(cachedKeys[cacheKey]) && cachedKeys[cacheKey].includes(word)
        }
    );

    if (!hasAllWordsFetched) {
        return [];
    }

    return keysWithWords.map(({ word, key }) => {
        if (!key) {
            return;
        }
    
        const cacheKey = getCacheKey(lang, key);

        return {
            word,
            key,
            index: cachedKeys && cachedKeys[cacheKey] ? cachedKeys[cacheKey].findIndex((keyWords) => word === keyWords) : undefined,
        };
    });
};

export default getDoesWordExist;
