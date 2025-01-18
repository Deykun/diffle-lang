import type { SpecialWordAction } from './types';

/*
  Typing "hejto" will add #grywebowe to the shared result (a common tag for games like that on the hejto.pl platform).
*/
export const SPECIAL_WORDS_ACTIONS: {
  [specialWord: string]: SpecialWordAction,
} = {
  hejto: {
    customTag: '#grywebowe',
  },
};

export const SPECIAL_WORDS = Object.keys(SPECIAL_WORDS_ACTIONS);
