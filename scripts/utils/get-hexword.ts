import { removeDiacratics } from '../../src/api/helpers';

// Hex covers only a-f,but S looks a bit like 5
const lettersToHex = {
  // 'Q': '',
  // 'W': '',
  // 'E': '',
  // 'R': '',
  'T': '7',
  // 'Y': '',
  // 'U': '',
  'I': '1',
  'O': '0',
  // 'P': '',
  // 'A': '4', - is covered by hex
  'S': '5',
  // 'D': '0', - is covered by hex
  // 'F': '',
  'G': '6',
  // 'H': '',
  // 'J': '1',
  // 'K': '',
  'Z': '2',
  // 'X': '',
  // 'C': '',
  // 'V': '',
  // 'B': '3', - is covered by hex
  // 'N': '',
  // 'M': '',
}

const lettersToSwap = Object.keys(lettersToHex);

export const getHexwordStatus = (word: string) => {
  // #ddd #d1d1d1 #d1d1d1d1 - possible hexes
  if (![3,6,8].includes(word.length)) {
    return undefined;
  }

  let transformedWord = removeDiacratics(word).toUpperCase();

  lettersToSwap.forEach((letter) => {
    transformedWord = transformedWord.replaceAll(letter, lettersToHex[letter]); 
  })

  const isHexWord = transformedWord.match(/^[A-F0-9]+$/) !== null;
  if (isHexWord) {
    console.log(`#${transformedWord} as ${word}`);
  }
};