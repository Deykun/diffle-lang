import { useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'wouter';

import { WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS } from '@const';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import { ModeFilter, CharactersFilter, LengthFilter } from '@utils/statistics';

import useEnhancedDetails from '@hooks/useEnhancedDetails';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';
import IconDay from '@components/Icons/IconDay';
import IconFlag from '@components/Icons/IconFlag';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconInfinity from '@components/Icons/IconInfinity';
import IconLayersAlt from '@components/Icons/IconLayersAlt';
import IconRulerSmall from '@components/Icons/IconRulerSmall';
import IconRulerBig from '@components/Icons/IconRulerBig';

import ButtonTile from '@components/Button/ButtonTile';


import '../Settings/Settings.scss';
import { StatisticUrlFilters, getFilterURLValues, getFiltersFromSearch } from './utils/statistics-params';


const StatisticsFilters = () => {
  const { hasSpecialCharacters: hasLanguageSpecialCharacters } = useSelector(selectGameLanguageKeyboardInfo);
  const [searchParams, setSearchParams] = useSearchParams();

  const filtersData = useMemo(() => {
    return getFiltersFromSearch(searchParams);
  }, [searchParams]);

  const { t } = useTranslation();

  const { handleClickSummary } = useEnhancedDetails();

  const handleFilterChange = useCallback((name: StatisticUrlFilters, value: string) => {
    setSearchParams((prev) => ({
      ...getFilterURLValues(prev),
      [name]: value,
    }), {
      replace: true,
    });
  }, []);


  useEffect(() => {
    // After changing language
    const shouldResetSpecialCharacters =
      !hasLanguageSpecialCharacters && filtersData.charactersFilter !== CharactersFilter.All;
    if (shouldResetSpecialCharacters) {
      handleFilterChange('characters', CharactersFilter.All);
    }
  }, [filtersData.charactersFilter, hasLanguageSpecialCharacters]);

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
              isActive={filtersData.modeFilter === ModeFilter.All}
              onClick={() => handleFilterChange('mode', ModeFilter.All)}
            >
              <IconLayersAlt />
              <span>{t('statistics.filterAll')}</span>
            </ButtonTile>
          </li>
          <li>
            <ButtonTile
              isActive={filtersData.modeFilter === ModeFilter.Daily}
              onClick={() => handleFilterChange('mode', ModeFilter.Daily)}
            >
              <IconDay />
              <span>{t('game.modeDaily')}</span>
            </ButtonTile>
          </li>
          <li>
            <ButtonTile
              isActive={filtersData.modeFilter === ModeFilter.Practice}
              onClick={() => handleFilterChange('mode', ModeFilter.Practice)}
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
                isActive={filtersData.charactersFilter === CharactersFilter.All}
                onClick={() => handleFilterChange('characters', CharactersFilter.All)}
              >
                <IconLayersAlt />
                <span>{t('statistics.filterAll')}</span>
              </ButtonTile>
            </li>
            <li>
              <ButtonTile
                isActive={filtersData.charactersFilter === CharactersFilter.NoSpecial}
                onClick={() => handleFilterChange('characters', CharactersFilter.NoSpecial)}
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
                isActive={filtersData.charactersFilter === CharactersFilter.Special}
                onClick={() => handleFilterChange('characters', CharactersFilter.Special)}
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
              isActive={filtersData.lengthFilter === LengthFilter.All}
              onClick={() => handleFilterChange('length', LengthFilter.All)}
            >
              <IconLayersAlt />
              <span>{t('statistics.filterAll')}</span>
            </ButtonTile>
          </li>
          <li>
            <ButtonTile
              isActive={filtersData.lengthFilter === LengthFilter.Short}
              onClick={() => handleFilterChange('length', LengthFilter.Short)}
            >
              <IconRulerSmall />
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: t('statistics.wordLengthShort', {
                    to: WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS,
                  }),
                }}
              />
            </ButtonTile>
          </li>
          <li>
            <ButtonTile
              isActive={filtersData.lengthFilter === LengthFilter.Long}
              onClick={() => handleFilterChange('length', LengthFilter.Long)}
            >
              <IconRulerBig />
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: t('statistics.wordLengthLong', {
                    above: WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS,
                  }),
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
