import fs from "fs";

import { ParsedHejtoResult } from "./hejto-types";

import { getInfoAboutResults } from "./utils/results-parser";

import { results as results1 } from "./parts/part-1";
import { results as results2 } from "./parts/part-2";
import { results as results3 } from "./parts/part-3";
import { results as results4 } from "./parts/part-4";
import { results as results5 } from "./parts/part-5";
import { results as results6 } from "./parts/part-6";
import { results as results7 } from "./parts/part-7";
import { results as results8 } from "./parts/part-8";

export const resultsBySource: {
  [url: string]: ParsedHejtoResult[];
} = {
  ...results1.resultsBySource,
  ...results2.resultsBySource,
  ...results3.resultsBySource,
  ...results4.resultsBySource,
  ...results5.resultsBySource,
  ...results6.resultsBySource,
};

const { resultsByUser, resultsByLang, resultsByWord, wordsByDate } = Object.values(resultsBySource)
  .flatMap((v) => v)
  .reduce(
    (
      stack: {
        resultsByUser: {
          [lang: string]: {
            [nick: string]: {
              [word: string]: ParsedHejtoResult;
            };
          };
        };
        resultsByWord: {
          [lang: string]: {
              [word: string]: ParsedHejtoResult[];
          };
        },
        resultsByLang: {
          [lang: string]: ParsedHejtoResult[];
        };
        wordsByDate: {
          [lang: string]: {
            [date: string]: {
              [word: string]: number,
            },
          },
        },
      },
      item
    ) => {
      const { nick, result, lang, date } = item;

      const { word } = result || {};

      if (lang && !stack.resultsByLang[lang]) {
        stack.resultsByLang[lang] = [];
      }

      if (lang && word) {
        if (!stack.resultsByWord[lang]) {
          stack.resultsByWord[lang] = {};
        }

        if (stack.resultsByWord[lang][word]) {
          stack.resultsByWord[lang][word].push(item);
        } else {
          stack.resultsByWord[lang][word] = [item];
        }
      }

      if (lang && date && word) {
        if (!stack.wordsByDate[lang]) {
          stack.wordsByDate[lang] = {};
        }

        if (!stack.wordsByDate[lang][date]) {
          stack.wordsByDate[lang][date] = {};
        }

        if (!stack.wordsByDate[lang][date][word]) {
          stack.wordsByDate[lang][date][word] += 1;
        } else {
          stack.wordsByDate[lang][date][word] = 1;
        }
      }

      if (lang && nick && word) {
        if (!stack.resultsByUser[lang]) {
          stack.resultsByUser[lang] = {};
        }

        if (!stack.resultsByUser[lang][nick]) {
          stack.resultsByUser[lang][nick] = {};
        }

        if (!stack.resultsByUser[lang][nick][word]) {
          stack.resultsByUser[lang][nick][word] = item;
          stack.resultsByLang[lang].push(item);
        }
      }

      return stack;
    },
    {
      resultsByUser: {},
      resultsByWord: {},
      resultsByLang: {},
      wordsByDate: {},
    }
  );

const langs = Object.keys(resultsByLang);

const wordsByDates = langs.reduce((globalStack, lang) => {
  const wordsByDatesForLang = Object.entries(wordsByDate[lang]).map(([date, usageByWord]) => {
      const [mostPopularWord] = Object.entries((usageByWord)).sort(([, a], [, b]) => b - a)[0];

      return { date, mostPopularWord };
  }, []).sort((a, b) => {
    const [aDay, aMonth] = a.date.split('.').map(Number);
    const [bDay, bMonth] = b.date.split('.').map(Number);
    
    const aRank = (aMonth * 1000) + aDay;
    const bRank = (bMonth * 1000) + bDay;

    return bRank - aRank;
  }).reduce((stack: { [date: string]: string }, item) => {
    stack[item.date] = item.mostPopularWord; 
    
    return stack;
  }, {});

  globalStack[lang] = wordsByDatesForLang;

  return globalStack;
}, {});

const acceptedWordsByLang = langs.reduce((stack, lang) => {
  stack[lang] = Object.values(wordsByDates[lang]);

  return stack;
}, {});

const scoreByWords = langs.reduce((globalStack, lang) => {
  globalStack[lang] = Object.entries(resultsByWord[lang]).reduce((stack, [word, results]) => {
    if (acceptedWordsByLang[lang].includes(word)) {
      stack[word] = getInfoAboutResults(results);
    }

    return stack;
  })

  return globalStack;
}, {});

const usersSummary = Object.entries(resultsByUser).reduce(
  (stack, [lang, resultsByNickForLang]) => {
    stack[lang] = Object.keys(resultsByNickForLang).reduce((stack, nick) => {
      const acceptedResults = Object.values(resultsByNickForLang[nick]).filter(({ result }) => acceptedWordsByLang[lang].includes(result.word));

      const userStatsByMonths = [1,2,3,4,5,6,7,8,9,10,11,12].reduce((stack, month) => {
        const acceptedResultsForMonth = acceptedResults.filter((item) => Number(item?.result?.date?.split('.')[1]) === month);

        if (acceptedResultsForMonth.length > 0) {
          stack[month] = getInfoAboutResults(acceptedResultsForMonth);
        }

        return stack;
      }, {});

      stack[nick] = {
        year: getInfoAboutResults(acceptedResults),
        ...userStatsByMonths,
      }

      return stack;
    }, {});

    return stack;
  },
  {}
);



langs.forEach((lang) => {

  fs.writeFileSync(
    `./public/year-summary/${lang}-info.json`,
    JSON.stringify(
      {
        ...getInfoAboutResults(resultsByLang[lang]),
        activePlayers: Object.keys(resultsByUser[lang]).length,
        byUser: usersSummary[lang],
        wordsByDates: wordsByDates[lang],
        scoreByWords,
      },
      null,
      "\t"
    )
  );
});
