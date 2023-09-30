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

export const getDoesWordExist = async (word: string): Promise<getDoesWordExistReport> => {
    const key = getNormalizedKey(word);

    if (!key) {
        return {
            doesWordExist: false,
            isError: true,
            errorType: DoesWordExistErrorType.TooShort,
        };
    }

    if (!cachedKeys[key]) {
        try {
            const response = await fetch(`./dictionary/spelling/chunk-${key}.json`).catch(error => {
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

export default getDoesWordExist;
