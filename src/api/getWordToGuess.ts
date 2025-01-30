import { GameMode, Catalog } from '@common-types';

import { getNow } from '@utils/date';

const getRandomInt = (min: number, max: number): number => {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);

  return Math.floor(Math.random() * (maxFloor - minCeil) + minCeil); // The maximum is exclusive and the minimum is inclusive
};

const getRandomIntForDaily = () => {
  const { dateSeed } = getNow();

  return dateSeed;
};

type FetchedCatalogByKeys = {
  [lang: string]: Catalog,
};

const cachedCatalogs: FetchedCatalogByKeys = {};

export const getEasterDayInfoIfFetched = (gameLanguage: string) => {
  if (gameLanguage && cachedCatalogs[gameLanguage]) {
    const { stampDateWithoutYear } = getNow();

    if (cachedCatalogs[gameLanguage].easterEggDays[stampDateWithoutYear as keyof Catalog]) {
      return cachedCatalogs[gameLanguage].easterEggDays[stampDateWithoutYear as keyof Catalog];
    }
  }

  return undefined;
};

export const getCatalogInfo = async (gameLanguage: string) => {
  if (cachedCatalogs[gameLanguage]) {
    return cachedCatalogs[gameLanguage];
  }

  const catalogResponse = await fetch(`./dictionary/${gameLanguage}/catalog.json`);
  const {
    words = 0,
    items = [],
    easterEggDays = {},
    winningWordsLengths = {},
    maxPopularityPosition = 0,
  }: Catalog = await catalogResponse.json();

  const cataolgResult: Catalog = {
    words,
    items,
    easterEggDays,
    winningWordsLengths,
    maxPopularityPosition,
  };

  cachedCatalogs[gameLanguage] = cataolgResult;

  return cataolgResult;
};

export const getWordToGuess = async (
  { gameMode, gameLanguage, seedNumber }: { gameMode: GameMode, gameLanguage: string, seedNumber?: number },
): Promise<string> => {
  const { words: totalNumberOfWords, items } = await getCatalogInfo(gameLanguage);

  return 'folly';

  let randomInt: number;
  if (seedNumber) {
    randomInt = seedNumber;
  } else {
    randomInt = gameMode === GameMode.Daily ? getRandomIntForDaily() : getRandomInt(totalNumberOfWords, totalNumberOfWords * 3);
  }

  const indexOfWord = randomInt % totalNumberOfWords;

  const keyItem = items.find(({ endIndex }) => endIndex >= indexOfWord);

  if (!keyItem) {
    throw new Error('Missing key item');
  }

  const { key, endIndex } = keyItem;

  const winingKeyResponse = await fetch(`./dictionary/${gameLanguage}/winning/chunk-${key}.json`);

  const winingKeyResult = await winingKeyResponse.json();

  const wordIndex = endIndex - indexOfWord;

  const word = winingKeyResult[wordIndex];

  return word;
};

export default getWordToGuess;
