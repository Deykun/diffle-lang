import {
  Filters, ModeFilter, CharactersFilter, LengthFilter,
} from '@utils/statistics';

export const ALL_DATA_FILTERS: Filters = {
  modeFilter: ModeFilter.All,
  charactersFilter: CharactersFilter.All,
  lengthFilter: LengthFilter.All,
};

export const INITIAL_FILTERS: Filters = {
  modeFilter: ModeFilter.Daily,
  charactersFilter: CharactersFilter.All,
  lengthFilter: LengthFilter.All,
};
