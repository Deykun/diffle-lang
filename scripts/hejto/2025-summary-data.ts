import fs from "fs";
import chalk from "chalk";

import { ParsedHejtoResult } from "./hejto-types";

import { getInfoAboutResults } from "./utils/results-parser";

import { results as results1 } from "./parts-2025/part-1";
import { results as results2 } from "./parts-2025/part-2";
import { results as results3 } from "./parts-2025/part-3";
import { results as results4 } from "./parts-2025/part-4";
import { results as results5 } from "./parts-2025/part-5";
import { results as results6 } from "./parts-2025/part-6";
import { results as results7 } from "./parts-2025/part-7";

export const resultsBySource: {
  [url: string]: ParsedHejtoResult[];
} = {
  ...results1.resultsBySource,
  ...results2.resultsBySource,
  ...results3.resultsBySource,
  ...results4.resultsBySource,
  ...results5.resultsBySource,
  ...results6.resultsBySource,
  ...results7.resultsBySource,
};

const {
  resultsByUser,
  datesWithoutWordsByUser,
  resultsByLang,
  resultsByWord,
  wordsByDate,
} = Object.values(resultsBySource)
  .flatMap((v) => v)
  .filter((v) => v.date?.includes("2025"))
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
        datesWithoutWordsByUser: {
          [lang: string]: {
            [nick: string]: string[];
          };
        };
        resultsByWord: {
          [lang: string]: {
            [word: string]: ParsedHejtoResult[];
          };
        };
        resultsByLang: {
          [lang: string]: ParsedHejtoResult[];
        };
        wordsByDate: {
          [lang: string]: {
            [date: string]: {
              [word: string]: number;
            };
          };
        };
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

        if (typeof word === "string" && word.length > 3) {
          if (stack.resultsByWord[lang][word]) {
            stack.resultsByWord[lang][word].push(item);
          } else {
            stack.resultsByWord[lang][word] = [item];
          }
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
      } else if (lang && nick && date) {
        if (!stack.datesWithoutWordsByUser[lang]) {
          stack.datesWithoutWordsByUser[lang] = {};
        }

        if (!stack.datesWithoutWordsByUser[lang][nick]) {
          stack.datesWithoutWordsByUser[lang][nick] = [];
        }

        stack.datesWithoutWordsByUser[lang][nick][date] = true;
      }

      return stack;
    },
    {
      resultsByUser: {},
      datesWithoutWordsByUser: {},
      resultsByWord: {},
      resultsByLang: {},
      wordsByDate: {},
    }
  );

console.log(chalk.green(`Results dictionaries created.`));

const langs = Object.keys(resultsByLang);

const wordsByDates = langs.reduce((globalStack, lang) => {
  const wordsByDatesForLang = Object.entries(wordsByDate[lang])
    .map(([date, usageByWord]) => {
      const [mostPopularWord] = Object.entries(usageByWord).sort(
        ([, a], [, b]) => b - a
      )[0];

      return { date, mostPopularWord };
    }, [])
    .sort((a, b) => {
      const [aDay, aMonth] = a.date.split(".").map(Number);
      const [bDay, bMonth] = b.date.split(".").map(Number);

      const aRank = aMonth * 1000 + aDay;
      const bRank = bMonth * 1000 + bDay;

      return bRank - aRank;
    })
    .reduce((stack: { [date: string]: string }, item) => {
      stack[item.date] = item.mostPopularWord;

      return stack;
    }, {});

  globalStack[lang] = wordsByDatesForLang;

  return globalStack;
}, {});

const datesByWords = langs.reduce((stack, lang) => {
  stack[lang] = Object.fromEntries(
    Object.entries(wordsByDates[lang]).map(([key, value]) => [value, key])
  );

  return stack;
}, {});

console.log("Words by dates index created.");

const acceptedWordsByLang = langs.reduce((stack, lang) => {
  stack[lang] = Object.values(wordsByDates[lang]);

  return stack;
}, {});

const rankByWords = langs.reduce((globalStack, lang) => {
  globalStack[lang] = Object.entries(resultsByWord[lang]).reduce(
    (stack, [word, results]) => {
      if (word && acceptedWordsByLang[lang].includes(word)) {
        stack[word] = getInfoAboutResults(results);
      }

      return stack;
    },
    {}
  );

  return globalStack;
}, {});

const wordsByRank = langs.reduce((stack, lang) => {
  stack[lang] = {
    hardestWords: [...Object.keys(rankByWords[lang])]
      .sort((a, b) => {
        const medianLettersA = rankByWords[lang][a].medianLetters;
        const medianLettersB = rankByWords[lang][b].medianLetters;

        if (medianLettersA === medianLettersB) {
          const medianWordsA = rankByWords[lang][a].medianWords;
          const medianWordsB = rankByWords[lang][b].medianWords;

          if (medianWordsA === medianWordsB) {
            return (
              rankByWords[lang][b].gamesPlayed -
              rankByWords[lang][a].gamesPlayed
            );
          }

          return medianWordsB - medianWordsA;
        }

        return medianLettersB - medianLettersA;
      })
      .slice(0, 50),
    bestWords: [...Object.keys(rankByWords[lang])]
      .sort((a, b) => {
        const medianLettersA = rankByWords[lang][a].medianLetters;
        const medianLettersB = rankByWords[lang][b].medianLetters;

        if (medianLettersA === medianLettersB) {
          const medianWordsA = rankByWords[lang][a].medianWords;
          const medianWordsB = rankByWords[lang][b].medianWords;

          if (medianWordsA === medianWordsB) {
            return (
              rankByWords[lang][b].gamesPlayed -
              rankByWords[lang][a].gamesPlayed
            );
          }

          return medianWordsA - medianWordsB;
        }

        return medianLettersA - medianLettersB;
      })
      .slice(0, 50),
  };

  return stack;
}, {});

const usersSummary = Object.entries(resultsByUser).reduce(
  (stack, [lang, resultsByNickForLang]) => {
    stack[lang] = Object.keys(resultsByNickForLang).reduce((stack, nick) => {
      const acceptedResults = Object.values(resultsByNickForLang[nick]).filter(
        ({ result }) => acceptedWordsByLang[lang].includes(result?.word)
      );

      const bestForDates =
        acceptedResults
          .filter(
            ({ result }) =>
              result?.word &&
              rankByWords[lang][result.word].best.letters ===
                result.totalLetters
          )
          .map(({ result }) => result?.date || "") || [];

      const worstForDates =
        acceptedResults
          .filter(
            ({ result }) =>
              result?.word &&
              rankByWords[lang][result.word].worst.letters ===
                result.totalLetters
          )
          .map(({ result }) => result?.date || "") || [];

      const {
        userStatsByMonths,
        bestForDatesForMonths,
        worstForDatesForMonths,
      } = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce(
        (stack, month) => {
          const acceptedResultsForMonth = acceptedResults.filter(
            (item) => Number(item?.result?.date?.split(".")[1]) === month
          );

          if (acceptedResultsForMonth.length > 0) {
            stack.userStatsByMonths[month] = getInfoAboutResults(
              acceptedResultsForMonth
            );
          }

          const bestForDatesForMonth = bestForDates.filter((date) =>
            date.endsWith(`${month}.2025`)
          );

          if (bestForDatesForMonth.length > 0) {
            stack.bestForDatesForMonths[month] = bestForDatesForMonth;
          }

          const worstForDatesForMonth = worstForDates.filter((date) =>
            date.endsWith(`${month}.2025`)
          );

          if (worstForDatesForMonth.length > 0) {
            stack.worstForDatesForMonths[month] = worstForDatesForMonth;
          }

          return stack;
        },
        {
          userStatsByMonths: {},
          bestForDatesForMonths: {},
          worstForDatesForMonths: {},
        }
      );

      const best50Results =
        acceptedResults.length >= 50
          ? [...acceptedResults]
              .sort(
                (a, b) =>
                  (a.result?.totalLetters || 0) - (b.result?.totalLetters || 0)
              )
              .slice(0, 50)
          : undefined;

      const hardest50Results = [...acceptedResults]
        .filter(({ result }) =>
          wordsByRank[lang].hardestWords.includes(result?.word)
        )
        .sort(
          (a, b) =>
            (a.result?.totalLetters || 0) - (b.result?.totalLetters || 0)
        );

      stack[nick] = {
        best50: best50Results ? getInfoAboutResults(best50Results) : undefined,
        hardest50:
          hardest50Results && hardest50Results.length > 35
            ? getInfoAboutResults(hardest50Results)
            : undefined,
        results: {
          year: getInfoAboutResults(acceptedResults),
          ...userStatsByMonths,
        },
        dates: {
          year: bestForDates,
          ...bestForDatesForMonths,
        },
        worstDates: {
          year: worstForDates,
          ...worstForDatesForMonths,
        },
      };

      return stack;
    }, {});

    return stack;
  },
  {}
);

langs.forEach((lang) => {
  fs.writeFileSync(
    `./public/year-summary/2025/${lang}-info.json`,
    JSON.stringify(
      {
        all: getInfoAboutResults(resultsByLang[lang]),
        activePlayers: Object.keys(resultsByUser[lang]).length,
        byUser: usersSummary[lang],
        wordsByDates: wordsByDates[lang],
        datesByWords: datesByWords[lang],
        rankByWords: rankByWords[lang],
        hardestWords: wordsByRank[lang].hardestWords,
        bestWords: wordsByRank[lang].bestWords,
      },
      null,
      "\t"
    )
  );
});
