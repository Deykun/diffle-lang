import fs from 'fs';

import { ParsedHejtoResult } from './hejto-types';

import { getInfoAboutResults } from './utils/results-parser';

import { results as results1 } from './parts/part-1';
import { results as results2 } from './parts/part-2';

export const resultsBySource: {
  [url: string]: ParsedHejtoResult[] 
} = {
  ...results1.resultsBySource,
  ...results2.resultsBySource,
};

const {
  resultsByUser,
  resultsByLang,
} = Object.values(resultsBySource).flatMap((v) => v).reduce((stack: {
  resultsByUser: {
    [lang: string]: {
      [nick: string]: {
        [word: string]: ParsedHejtoResult,
      },
    },
  },
  resultsByLang: {
    [lang: string]: ParsedHejtoResult[],
  },
}, item) => {
  const {
    nick,
    result,
    lang,
  } = item;

  const {
    word,
  } = result || {};

  if (lang && !stack.resultsByLang[lang]) {
    stack.resultsByLang[lang] = [];
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
}, {
  resultsByUser: {},
  resultsByLang: {},
});

const langs = Object.keys(resultsByLang);

const usersSummary = Object.entries(resultsByUser).reduce((stack, [lang, resultsByNickForLang]) => {
  stack[lang] = Object.keys(resultsByNickForLang).reduce((stack, nick) => {
    stack[nick] = getInfoAboutResults(Object.values(resultsByNickForLang[nick]));

    return stack;
  }, {});

  return stack;
}, {});

if (resultsByLang.pl) {
  console.log(getInfoAboutResults(resultsByLang.pl));
}

langs.forEach((lang) => {
  fs.writeFileSync(`./public/year-summary/${lang}-info.json`, JSON.stringify(getInfoAboutResults(resultsByLang[lang]), null, '\t'));
})
