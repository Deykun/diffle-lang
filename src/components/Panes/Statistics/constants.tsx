import {
  Filters, ModeFilter, CharactersFilter, LengthFilter,
} from '@utils/statistics';

export const INITIAL_FILTERS: Filters = {
  modeFilter: ModeFilter.Daily,
  charactersFilter: CharactersFilter.All,
  lengthFilter: LengthFilter.All,
};
