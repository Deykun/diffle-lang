import { GameMode } from '@common-types';
import { keepIfInEnum } from '@utils/ts';
import { CharactersFilter, Filters, LengthFilter, ModeFilter } from '@utils/statistics';
import { INITIAL_FILTERS } from '../constants';

const URLParams = {
  mode: 'mode',
  characters: 'characters',
  length: 'length',
} as const;

export type StatisticUrlFilters = keyof typeof URLParams;

export const getFilterURLValues = (search: string | URLSearchParams) => {
  const params = new URLSearchParams(search);

  return {
    mode: keepIfInEnum<ModeFilter>(params.get(URLParams.mode), ModeFilter) ?? INITIAL_FILTERS.modeFilter,
    characters:
      keepIfInEnum<CharactersFilter>(params.get(URLParams.characters), CharactersFilter) ??
      INITIAL_FILTERS.charactersFilter,
    length:
      keepIfInEnum<LengthFilter>(params.get(URLParams.length), LengthFilter) ?? INITIAL_FILTERS.lengthFilter,
  };
};

export const getFiltersFromSearch = (search: string | URLSearchParams) => {
  const urlValues = getFilterURLValues(search);

  return {
    modeFilter: urlValues.mode,
    charactersFilter: urlValues.characters,
    lengthFilter: urlValues.length,
  } satisfies Filters;
};

export const getSearchForMode = (mode: ModeFilter | GameMode) => {
  if (mode === INITIAL_FILTERS.modeFilter) {
    return '';
  }

  const filterableMode = keepIfInEnum<ModeFilter>(mode, ModeFilter);

  return filterableMode ? `?${URLParams.mode}=${mode}` : '';
};
