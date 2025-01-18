import { LOCAL_STORAGE } from '@const';

import { SPECIAL_WORDS_ACTIONS } from '@features/specialWords/const';

export const toggleSpecialWordIfApplied = (specialWord: string) => {
  const action = SPECIAL_WORDS_ACTIONS[specialWord];

  const response: {
    wasApplied: boolean,
    isActive?: boolean,
  } = {
    wasApplied: false,
  };

  if (action) {
    response.wasApplied = true;

    if (action.customTag) {
      const currentCustomTag = localStorage.getItem(LOCAL_STORAGE.CUSTOM_TAG) || '' as string;

      if (currentCustomTag === action.customTag) {
        response.isActive = false;
        localStorage.removeItem(LOCAL_STORAGE.CUSTOM_TAG);
      } else {
        response.isActive = true;
        localStorage.setItem(LOCAL_STORAGE.CUSTOM_TAG, action.customTag);
      }
    }
  }

  return response;
};
