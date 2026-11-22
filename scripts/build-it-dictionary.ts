import fs from "fs";

import { actionBuildDictionary } from "./utils/build-dictionary";

import { getWordsFromDictionary } from "./utils/parse-dictionary";

import {
  BLOCKED_WORDS,
  BLOCKED_PARTS,
  DICTIONARIES,
  LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
  EASTER_EGG_DAYS,
} from "../resources/it/constants";

const LANG = "it";

const spellcheckerDir = `./resources/${LANG}/${DICTIONARIES.spellchecker.dir}`;
const spellcheckerDictionaryPath = `${spellcheckerDir}/dictionary.txt`;

if (!fs.existsSync(spellcheckerDictionaryPath)) {
  console.log(`Missing: ${spellcheckerDictionaryPath}`);
  console.log(
    `It is gitignored, unmunch it first: npx tsx ${spellcheckerDir}/scripts/createDictionaryTXT.ts`,
  );
  process.exit(1);
}

const spellcheckerDictionary = fs.readFileSync(
  spellcheckerDictionaryPath,
  "utf-8",
);

const winningDictionary = fs.readFileSync(
  `./resources/${LANG}/${DICTIONARIES.winning.dir}/eng/dictionary.txt`,
  "utf-8",
);

const spellcheckerWords = getWordsFromDictionary(spellcheckerDictionary, {
  pattern: "word/ignore",
  lang: LANG,
});

const frequencyDictionary = fs.readFileSync(
  `./resources/${LANG}/${DICTIONARIES.popularity.dir}/dictionary.txt`,
  "utf-8",
);

const frequencyWords = getWordsFromDictionary(frequencyDictionary, {
  pattern: "word ignore",
  lang: LANG,
  limit: 75_000,
});

const [longestWinningWords, ...winningWordsDictionariesToCheck] = [
  getWordsFromDictionary(winningDictionary, {
    pattern: "word ignore",
    lang: LANG,
  }),
  frequencyWords,
].sort((a, b) => b.length - a.length);

const winningWords = longestWinningWords.filter((word) =>
  winningWordsDictionariesToCheck.every((wordList) => wordList.includes(word)),
);

actionBuildDictionary(
  {
    LANG,
    BLOCKED_WORDS,
    BLOCKED_PARTS,
    LETTERS_NOT_ALLOWED_IN_WINNING_WORD,
    DICTIONARIES,
    MAXIMUM_LENGTH_OF_ABOUT_LANGUAGE_WORD: 20,
    MAXIMUM_LENGTH_OF_SPELLCHEKER_WORD: 18,
    MAXIMUM_LENGTH_OF_WINNING_WORD: 10,
    EASTER_EGG_DAYS,
  },
  spellcheckerWords,
  winningWords,
  frequencyWords,
);
