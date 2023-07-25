import { getNormalizedKey } from './helpers';

type fetchedWordsListByKeys = {
    [key: string]: string[]
}

const cachedKeys: fetchedWordsListByKeys = {};

export const getDoesWordExist = async (word: string): Promise<boolean> => {
    const key = getNormalizedKey(word);

    if (!key) {
        return false;
    }

    if (!cachedKeys[key]) {
        try {
            const response = await fetch(`./dictionary/spelling/chunk-${key}.json`);

            const result = await response.json();

            cachedKeys[key] = result;
        } catch {
            cachedKeys[key] = [];
        }
    }

    return cachedKeys[key].includes(word);
};

export default getDoesWordExist;
