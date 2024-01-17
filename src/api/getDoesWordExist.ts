import { getNormalizedKey } from './helpers';

const game_lang = 'pl';

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

export const getDoesWordExist = async (word: string): Promise<getDoesWordExistReport> => {
    const gameLang = 'pl';

    const key = getNormalizedKey(word, gameLang);

    if (!key) {
        return {
            doesWordExist: false,
            isError: true,
            errorType: DoesWordExistErrorType.TooShort,
        };
    }

    if (!cachedKeys[key]) {
        try {
            const response = await fetch(`./dictionary/${game_lang}/spelling/chunk-${key}.json`).catch(error => {
                throw error;
            });

            if (response?.status === 404) {
                cachedKeys[key] = [];

                return {
                    doesWordExist: false,
                    isError: false,
                };
            }

            const result = await response.json();

            cachedKeys[key] = result;
        } catch (error) {
            return {
                doesWordExist: false,
                isError: true,
                errorType: DoesWordExistErrorType.Fetch,
            };
        }
    }

    const doesWordExist = cachedKeys[key].includes(word);

    return {
        doesWordExist,
        isError: false,
    };
};

interface KeyWithIndex {
    key: string,
    index: number,
}

export const getWordsFromKeysWithIndexes = async (keysWithIndexes: KeyWithIndex[]): Promise<string[]> => {
    const words = [];

    for (const keyWithIndex of keysWithIndexes) {
        const { key, index } = keyWithIndex;

        try {
            const response = await fetch(`./dictionary/${game_lang}/spelling/chunk-${key}.json`).catch(error => {
                throw error;
            });

            if (response?.status === 404) {
                cachedKeys[key] = [];
            }

            const result = await response.json();

            cachedKeys[key] = result;
        } catch (error) {
            // 
        }

        const word = cachedKeys[key][index];

        if (word) {
            words.push(word);
        }

    }

    return words;
};

export const getWordsIndexesChunks = (words: string[]) => {
    const gameLang = 'pl';

    const keysWithWords = words.map((word) => ({ word, key: getNormalizedKey(word, gameLang) }));
    const hasAllWordsFetched = keysWithWords.every(
        ({ word, key }) => key && Array.isArray(cachedKeys[key]) && cachedKeys[key].includes(word)
    );

    if (!hasAllWordsFetched) {
        return [];
    }

    return keysWithWords.map(({ word, key }) => {
        return {
            word,
            key,
            index: key ? cachedKeys[key].findIndex((keyWords) => word === keyWords) : undefined,
        };
    });
};

export default getDoesWordExist;
