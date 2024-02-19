import { removeDiacratics } from '@api/helpers';

export const getHasSpecialCharacters = (text: string) => {
    return text !== removeDiacratics(text);
};
