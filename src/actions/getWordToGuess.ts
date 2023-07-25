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

export const getWordToGuess = async (): Promise<string> => {
    const catalogResponse = await fetch(`./dictionary/catalog.json`);

    const cataolgResult: { words: number, items: catalogItem[] } = await catalogResponse.json();

    console.log('cataolgResult', cataolgResult);

    const { words, items } = cataolgResult;

    const randomInt = getRandomInt(words, words * 3);

    const indexOfWord = randomInt % words;

    const keyItem = items.find(({ endIndex }) => endIndex >= indexOfWord );

    if (!keyItem) {
        throw 'Missing key item';
    }

    const { key, endIndex } = keyItem;

    const winingKeyResponse = await fetch(`./dictionary/winning/chunk-${key}.json`);

    const winingKeyResult = await winingKeyResponse.json();

    const wordIndex = endIndex - indexOfWord;

    const word = winingKeyResult[wordIndex];

    return word;
};

export default getWordToGuess;
