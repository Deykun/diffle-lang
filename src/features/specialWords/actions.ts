import { LOCAL_STORAGE } from '@const';

import { SPECIAL_WORDS_ACTIONS } from '@features/specialWords/const';

export const toggleSpecialWordIfApplied = (specialWord: string) => {
  const action = SPECIAL_WORDS_ACTIONS[specialWord];

  if (action) {
    if (action.customTag) {
      const currentCustomTag = localStorage.getItem(LOCAL_STORAGE.CUSTOM_TAG) || '' as string;

      if (currentCustomTag === action.customTag) {
        localStorage.removeItem(LOCAL_STORAGE.CUSTOM_TAG);
      } else {
        localStorage.setItem(LOCAL_STORAGE.CUSTOM_TAG, action.customTag);
      }
    }
  }
};
