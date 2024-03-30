import {
  useEffect, useState, Dispatch, SetStateAction,
} from 'react';
import { useTranslation } from 'react-i18next';

import { WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS } from '@const';

import { useDispatch, useSelector } from '@store';
import { track } from '@store/appSlice';
import {
  selectGameLanguageKeyboardInfo,
} from '@store/selectors';

import {
  keepIfInEnum,
} from '@utils/ts';
import {
  Filters,
  ModeFilter,
  CharactersFilter,
  LengthFilter,
} from '@utils/statistics';

import usePanes from '@hooks/usePanes';
import useVibrate from '@hooks/useVibrate';
import useEnhancedDetails from '@hooks/useEnhancedDetails';
import useEffectChange from '@hooks/useEffectChange';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';
import IconDay from '@components/Icons/IconDay';
import IconFlag from '@components/Icons/IconFlag';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconInfinity from '@components/Icons/IconInfinity';
import IconLayersAlt from '@components/Icons/IconLayersAlt';
import IconRulerSmall from '@components/Icons/IconRulerSmall';
import IconRulerBig from '@components/Icons/IconRulerBig';

import ButtonTile from '@components/Button/ButtonTile';

import { INITIAL_FILTERS } from './constants';

import '../Settings/Settings.scss';

interface Props {
  setFiltersData: Dispatch<SetStateAction<Filters>>
}

const StatisticsFilters = ({ setFiltersData }: Props) => {
  const dispatch = useDispatch();
  const {
    paneParams: {
      modeFilter: paneModeFilter = '',
    },
  } = usePanes();
  const initialModeFilter = keepIfInEnum<ModeFilter>(paneModeFilter, ModeFilter) ?? INITIAL_FILTERS.modeFilter;

  const { hasSpecialCharacters: hasLanguageSpecialCharacters } = useSelector(selectGameLanguageKeyboardInfo);
  const [modeFilter, setModeFilter] = useState<ModeFilter>(initialModeFilter);
  const [charactersFilter, setModeCharactersFilter] = useState<CharactersFilter>(INITIAL_FILTERS.charactersFilter);
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>(INITIAL_FILTERS.lengthFilter);

  const { t } = useTranslation();

  const { vibrate } = useVibrate();

  const { handleClickSummary } = useEnhancedDetails();

  useEffectChange(() => {
    vibrate();
  }, [modeFilter, charactersFilter, lengthFilter]);

  useEffect(() => {
    const filtersData = {
      modeFilter,
      charactersFilter,
      lengthFilter,
    };

    dispatch(track({ name: 'click_statistics_filter', params: { filters: `${modeFilter}_${charactersFilter}_${lengthFilter}` } }));

    setFiltersData(filtersData);
  }, [modeFilter, charactersFilter, lengthFilter, setFiltersData, dispatch]);

  useEffect(() => {
    // After changing language
    const shouldResetSpecialCharacters = !hasLanguageSpecialCharacters && charactersFilter !== CharactersFilter.All;
    if (shouldResetSpecialCharacters) {
      setModeCharactersFilter(CharactersFilter.All);
    }
  }, [charactersFilter, hasLanguageSpecialCharacters]);

  return (
      <details className="statistics-filters">
          <summary onClick={handleClickSummary}>
              <h3>{t('statistics.filters')}</h3>
              <IconAnimatedCaret className="details-icon" />
          </summary>
          <div className="details-content">
              <ul className="list-col-3">
                  <li>
                      <ButtonTile
                        isActive={modeFilter === ModeFilter.All}
                        onClick={() => setModeFilter(ModeFilter.All)}
                      >
                          <IconLayersAlt />
                          <span>{t('statistics.filterAll')}</span>
                      </ButtonTile>
                  </li>
                  <li>
                      <ButtonTile
                        isActive={modeFilter === ModeFilter.Daily}
                        onClick={() => setModeFilter(ModeFilter.Daily)}
                      >
                          <IconDay />
                          <span>{t('game.modeDaily')}</span>
                      </ButtonTile>
                  </li>
                  <li>
                      <ButtonTile
                        isActive={modeFilter === ModeFilter.Practice}
                        onClick={() => setModeFilter(ModeFilter.Practice)}
                      >
                          <IconInfinity />
                          <span>{t('game.modePractice')}</span>
                      </ButtonTile>
                  </li>
              </ul>
              {hasLanguageSpecialCharacters && (
              <ul className="list-col-3">
                  <li>
                      <ButtonTile
                        isActive={charactersFilter === CharactersFilter.All}
                        onClick={() => setModeCharactersFilter(CharactersFilter.All)}
                      >
                          <IconLayersAlt />
                          <span>{t('statistics.filterAll')}</span>
                      </ButtonTile>
                  </li>
                  <li>
                      <ButtonTile
                        isActive={charactersFilter === CharactersFilter.NoSpecial}
                        onClick={() => setModeCharactersFilter(CharactersFilter.NoSpecial)}
                      >
                          <IconFlag />
                          <span
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                              __html: t('statistics.specialCharactersWithout'),
                            }}
                          />
                      </ButtonTile>
                  </li>
                  <li>
                      <ButtonTile
                        isActive={charactersFilter === CharactersFilter.Special}
                        onClick={() => setModeCharactersFilter(CharactersFilter.Special)}
                      >
                          <IconFlagAlt />
                          <span
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                              __html: t('statistics.specialCharactersWith'),
                            }}
                          />
                      </ButtonTile>
                  </li>
              </ul>
              )}
              <ul className="list-col-3">
                  <li>
                      <ButtonTile
                        isActive={lengthFilter === LengthFilter.All}
                        onClick={() => setLengthFilter(LengthFilter.All)}
                      >
                          <IconLayersAlt />
                          <span>{t('statistics.filterAll')}</span>
                      </ButtonTile>
                  </li>
                  <li>
                      <ButtonTile
                        isActive={lengthFilter === LengthFilter.Short}
                        onClick={() => setLengthFilter(LengthFilter.Short)}
                      >
                          <IconRulerSmall />
                          <span
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                              __html: t('statistics.wordLengthShort', { to: WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS }),
                            }}
                          />
                      </ButtonTile>
                  </li>
                  <li>
                      <ButtonTile
                        isActive={lengthFilter === LengthFilter.Long}
                        onClick={() => setLengthFilter(LengthFilter.Long)}
                      >
                          <IconRulerBig />
                          <span
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                              __html: t('statistics.wordLengthLong', { above: WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS }),
                            }}
                          />
                      </ButtonTile>
                  </li>
              </ul>
          </div>
      </details>
  );
};

export default StatisticsFilters;
