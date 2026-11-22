import chalk from "chalk";
import { formatLargeNumber } from "../../src/utils/format";
import { getIsWordValid } from "./parse-dictionary";

export const getWordsFromHunspellDictionary = (
  words: string[],
  {
    lang,
  }: {
    lang: string;
  },
) => {
  console.log("");
  console.log(`Parsing Hunspell dictionary #${chalk.blue(lang)}`);

  const validWords = [...new Set(words)].filter(
    (word) => word !== "" && getIsWordValid(word, lang),
  );

  console.log(
    ` - ${chalk.green(formatLargeNumber(validWords.length))} valid words`,
  );
  console.log(
    ` - ${chalk.green(formatLargeNumber(words.length))} received words`,
  );

  return validWords;
};
