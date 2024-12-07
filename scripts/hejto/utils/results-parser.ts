import { ParsedHejtoResult } from '../hejto-types';
import { results } from '../parts/part-1';

const getMedian = (medianData: { [value: number]: number }) => {
  const { 0: zero, ...medianDataWithouZero } = medianData;
  const totalDataInMedian = Object.values(medianDataWithouZero).reduce((stack, totalForValue) => stack + totalForValue, 0);
  const medianIndex = Math.floor(totalDataInMedian / 2);
  const shouldUseAverage = totalDataInMedian % 2 === 0;

  const sortedData = Object.entries(medianDataWithouZero).sort(([valueA], [valueB]) => Number(valueA) - Number(valueB));

  let currenIndex = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < sortedData.length; i++) {
    const [value, total] = sortedData[i];

    currenIndex += total;

    if (medianIndex < currenIndex) {
      if (shouldUseAverage) {
        const previousValue = Number(sortedData[i - 1]?.[0]);

        if (previousValue) {
          return (Number(value) + previousValue) / 2;
        }
      }

      return Number(value);
    }
  }

  // It shouldn't be possible
  return 0;
};

export const getInfoAboutResults = (items: ParsedHejtoResult[]) => {
  const data = items.reduce((stack, item) => {
    if (item.result.totalWords) {
      if (stack.totalWords[item.result.totalWords]) {
        stack.totalWords[item.result.totalWords] += 1;
      } else {
        stack.totalWords[item.result.totalWords] = 1;
      }
    }

    if (item.result.totalLetters) {
      if (stack.totalLetters[item.result.totalLetters]) {
        stack.totalLetters[item.result.totalLetters] += 1;
      } else {
        stack.totalLetters[item.result.totalLetters] = 1;
      }

      if (item.result.totalLetters < stack.best.letters) {
        stack.best = {
          word: item.result.word,
          letters: item.result.totalLetters,
        }
      }
  
      if (item.result.totalLetters > stack.worst.letters) {
        stack.worst = {
          word: item.result.word,
          letters: item.result.totalLetters,
        }
      }
    }

    return stack;
  }, {
    best: {
      word: '',
      letters: 200,
    },
    worst: {
      word: '',
      letters: 0,
    },
    totalWords: { },
    totalLetters: { },
  });

  return {
    ...data,
    gamesPlayed: items.length,
    medianWords: getMedian(data.totalWords),
    medianLetters: getMedian(data.totalLetters),
  }
}