/*
  Saves all word forms from core/it_IT.dic + core/it_IT.aff as dictionary.txt (one per line).

  Run: npx tsx resources/it/LibreItalia/scripts/createDictionaryTXT.ts
*/
import fs from 'fs';
import path from 'path';

import { getDictionaryWordsFromHunspell } from './getDictionaryWordsFromHunspell';

const OUTPUT_PATH = path.join(import.meta.dirname, '../dictionary.txt');

const createDictionaryTXT = () => {
  const words = getDictionaryWordsFromHunspell();

  fs.writeFileSync(OUTPUT_PATH, `${words.join('\n')}\n`);

  console.log(`Saved: ${OUTPUT_PATH}`);
};

createDictionaryTXT();
