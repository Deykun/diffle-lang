import clsx from 'clsx';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { StatisticDataForCard, Streak } from '@utils/statistics';
import { PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS } from '@const';

import {
    Filters,
    ModeFilter,
    CharactersFilter,
    LengthFilter,
    getStatisticForFilter,
    getStreakForFilter,
    getStatisticCardDataFromStatistics,
} from '@utils/statistics';

import useEnhancedDetails from '@hooks/useEnhancedDetails';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';
import IconInfinity from '@components/Icons/IconInfinity';
import IconDay from '@components/Icons/IconDay';
import IconFlag from '@components/Icons/IconFlag';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconLayersAlt from '@components/Icons/IconLayersAlt';
import IconRulerSmall from '@components/Icons/IconRulerSmall';
import IconRulerBig from '@components/Icons/IconRulerBig';

import { INITIAL_FILTERS } from './constants';

import '../Settings/Settings.scss'

interface Props {
    setData: Dispatch<SetStateAction<{
        filtersData: Filters,
        statisticsData: StatisticDataForCard | undefined,
        streakData: Streak | undefined,
    }>>
}

const StatisticsFilters = ({ setData }: Props) => {
    const [modeFilter, setModeFilter] = useState<ModeFilter>(INITIAL_FILTERS.modeFilter);
    const [charactersFilter, setModeCharactersFilter] = useState<CharactersFilter>(INITIAL_FILTERS.charactersFilter);
    const [lengthFilter, setLengthFilter] = useState<LengthFilter>(INITIAL_FILTERS.lengthFilter);

    const { t } = useTranslation();

    const { handleClickSummary } = useEnhancedDetails();

    useEffect(() => {
        const filtersData = {
            modeFilter,
            charactersFilter,
            lengthFilter,
        };

        const statistics = getStatisticForFilter(filtersData);
        const streakData = getStreakForFilter(filtersData);

        const statisticsData = getStatisticCardDataFromStatistics(statistics);

        setData({
            filtersData,
            statisticsData,
            streakData,
        });
    }, [modeFilter, charactersFilter, lengthFilter, setData]);
    
    return (
        <details className="statistics-filters">
            <summary onClick={handleClickSummary}>
                <h3>{t('statistics.filters')}</h3>
                <IconAnimatedCaret className="details-icon" />
            </summary>
            <div className="details-content">
                <ul className="list-col-3">
                    <li>
                        <button
                            className={clsx('setting', { 'setting-active': modeFilter === ModeFilter.All })}
                            onClick={() => setModeFilter(ModeFilter.All)}
                        >
                            <IconLayersAlt />
                            <span>{t('statistics.filterAll')}</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className={clsx('setting', { 'setting-active': modeFilter === ModeFilter.Daily })}
                            onClick={() => setModeFilter(ModeFilter.Daily)}
                        >
                            <IconDay />
                            <span>{t('game.modeDaily')}</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className={clsx('setting', { 'setting-active': modeFilter === ModeFilter.Practice })}
                            onClick={() => setModeFilter(ModeFilter.Practice)}
                        >
                            <IconInfinity />
                            <span>{t('game.modePractice')}</span>
                        </button>
                    </li>
                </ul>
                <ul className="list-col-3">
                    <li>
                        <button
                            className={clsx('setting', { 'setting-active': charactersFilter === CharactersFilter.All })}
                            onClick={() => setModeCharactersFilter(CharactersFilter.All)}
                        >
                            <IconLayersAlt />
                            <span>{t('statistics.filterAll')}</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className={clsx('setting', { 'setting-active': charactersFilter === CharactersFilter.NoSpecial })}
                            onClick={() => setModeCharactersFilter(CharactersFilter.NoSpecial)}
                        >
                            <IconFlag />
                            <span dangerouslySetInnerHTML={{
                                __html: t('statistics.specialCharactersWithout')
                            }} />
                        </button>
                    </li>
                    <li>
                        <button
                            className={clsx('setting', { 'setting-active': charactersFilter === CharactersFilter.Special })}
                            onClick={() => setModeCharactersFilter(CharactersFilter.Special)}
                        >
                            <IconFlagAlt />
                            <span dangerouslySetInnerHTML={{
                                __html: t('statistics.specialCharactersWith')
                            }} />
                        </button>
                    </li>
                </ul>
                <ul className="list-col-3">
                    <li>
                        <button
                            className={clsx('setting', { 'setting-active': lengthFilter === LengthFilter.All })}
                            onClick={() => setLengthFilter(LengthFilter.All)}
                        >
                            <IconLayersAlt />
                            <span>{t('statistics.filterAll')}</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className={clsx('setting', { 'setting-active': lengthFilter === LengthFilter.Short })}
                            onClick={() => setLengthFilter(LengthFilter.Short)}
                        >
                            <IconRulerSmall />
                            <span dangerouslySetInnerHTML={{
                                __html: t('statistics.wordLengthShort', { to: PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS })
                            }} />
                        </button>
                    </li>
                    <li>
                        <button
                            className={clsx('setting', { 'setting-active': lengthFilter === LengthFilter.Long })}
                            onClick={() => setLengthFilter(LengthFilter.Long)}
                        >
                            <IconRulerBig />
                            <span dangerouslySetInnerHTML={{
                                __html: t('statistics.wordLengthLong', { above: PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS })
                            }} />
                        </button>
                    </li>
                </ul>
            </div>
        </details>
    );
};

export default StatisticsFilters;
