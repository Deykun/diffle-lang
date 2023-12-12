import { GameMode } from '@common-types';

import { getNow } from '@utils/date';

const game_lang = 'pl';

// TODO: will be replaced with seed based on day
const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

type catalogItem = {
    key: string,
    endIndex: number,
    keyWords: number,
}

const getRandomIntForDaily = () => {
    const { dateSeed } = getNow();

    return dateSeed;
};

export const getWordToGuess = async ({ gameMode, seedNumber }: { gameMode: GameMode, seedNumber?: number }): Promise<string> => {
    const catalogResponse = await fetch(`./dictionary/${game_lang}/catalog.json`);

    const cataolgResult: { words: number, items: catalogItem[] } = await catalogResponse.json();

    const { words: totalNumberOfWords , items } = cataolgResult;

    let randomInt: number;
    if (seedNumber) {
        randomInt = seedNumber;
    } else {
        randomInt = gameMode === GameMode.Daily ? getRandomIntForDaily() : getRandomInt(totalNumberOfWords, totalNumberOfWords * 3);
    }

    const indexOfWord = randomInt % totalNumberOfWords;

    const keyItem = items.find(({ endIndex }) => endIndex >= indexOfWord );

    if (!keyItem) {
        throw 'Missing key item';
    }

    const { key, endIndex } = keyItem;

    const winingKeyResponse = await fetch(`./dictionary/${game_lang}/winning/chunk-${key}.json`);

    const winingKeyResult = await winingKeyResponse.json();

    const wordIndex = endIndex - indexOfWord;

    const word = winingKeyResult[wordIndex];

    return word;
};

export default getWordToGuess;
