import chalk from 'chalk';
import { removeDiacratics } from '../../src/api/helpers';
import { formatLargeNumber } from '../../src/utils/format';

export const getIsWordValid = (word: string, lang: string) => removeDiacratics(word, lang).replace(/[^a-z]/g, '').length === word.length;

type SUPPORTED_PATTERNS = 'word' | 'ignore word' | 'word ignore' | 'word/ignore'

let index = 1;

export const getWordsFromDictionary = (dictionary: string, {
  pattern,
  lang,
  limit = Infinity,
}: {
  pattern: SUPPORTED_PATTERNS,
  lang: string,
  limit?: number
}) => {
  const uniqueLines = [... new Set(dictionary.split(/\r?\n/).filter(Boolean).map((line) => line.toLowerCase().replace(/\s+/g,' ').trim()))] as string[];
  console.log('');
  console.log(`Parsing dictionary #${chalk.blue(`${lang}-${index}`)}`);

  let words: string[] = [];
  if (pattern === 'word') {
      words = uniqueLines;
  }

  if (pattern === 'ignore word') {
      words = uniqueLines.map(line => line.split(' ').at(-1) || '').filter(Boolean)
  }

  if (pattern === 'word ignore') {
    words = uniqueLines.map(line => line.split(' ')[0]).filter(Boolean)
  }

  if (pattern === 'word/ignore') {
    words = uniqueLines.map(line => line.split('/')[0]).filter(Boolean)
  }

  const uniqueWords = [...new Set(words)];

  const validWords = uniqueWords.filter(word => getIsWordValid(word, lang));

  console.log(` - ${chalk.green(formatLargeNumber(validWords.length))} valid words`);
  console.log(` - ${chalk.green(formatLargeNumber(uniqueLines.length))} parsed lines`);

  index = index + 1;

  if (validWords.length > limit) {
    console.log(` - valid words limited to ${chalk.green(formatLargeNumber(limit))}`);

    return validWords.slice(0, limit);
  }

  return validWords;
}