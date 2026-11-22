import { LOCAL_STORAGE } from "@const";

export const useIsAnimationLimited = () => {
  return localStorage.getItem(LOCAL_STORAGE.WORD_ANIMATION_BLOCK) === "true";
};
