import clsx from 'clsx';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { StatisticDataForCard, Streak } from '@utils/statistics';
import { PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS } from '@const';

import { Filters, ModeFilter, CharactersFilter, LengthFilter, getStatisticForFilter, getStreakForFilter, getStatisticCardDataFromStatistics } from '@utils/statistics';

import IconInfinity from '@components/Icons/IconInfinity';
import IconDay from '@components/Icons/IconDay';
import IconFlag from '@components/Icons/IconFlag';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconLayersAlt from '@components/Icons/IconLayersAlt';
import IconRulerSmall from '@components/Icons/IconRulerSmall';
import IconRulerBig from '@components/Icons/IconRulerBig';

import '../Settings/Settings.scss'

interface Props {
    setStatisticData: Dispatch<SetStateAction<StatisticDataForCard | undefined>>
    setStreakData: Dispatch<SetStateAction<Streak | undefined>>
    setFiltersData: Dispatch<SetStateAction<Filters | undefined>>
}

const StatisticsFilters = ({ setStatisticData, setStreakData, setFiltersData }: Props) => {
    const [modeFilter, setModeFilter] = useState<ModeFilter>(ModeFilter.Daily);
    const [charactersFilter, setModeCharactersFilter] = useState<CharactersFilter>(CharactersFilter.All);
    const [lengthFilter, setLengthFilter] = useState<LengthFilter>(LengthFilter.All);

    const { t } = useTranslation();

    useEffect(() => {
        const filters = {
            modeFilter,
            charactersFilter,
            lengthFilter,
        };
        const statistics = getStatisticForFilter(filters);
        const streakData = getStreakForFilter(filters);

        const statisitcsData = getStatisticCardDataFromStatistics(statistics);

        setStatisticData(statisitcsData);
        setStreakData(streakData);
        setFiltersData(filters);
    }, [modeFilter, charactersFilter, setStatisticData, lengthFilter, setStreakData, setFiltersData]);
    
    return (
        <div>
            <h3>{t('statistics.filters')}</h3>
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
                        <span>{t('statistics.specialCharactersWithout')}</span>
                    </button>
                </li>
                <li>
                    <button
                    className={clsx('setting', { 'setting-active': charactersFilter === CharactersFilter.Special })}
                    onClick={() => setModeCharactersFilter(CharactersFilter.Special)}
                    >
                        <IconFlagAlt />
                        <span>{t('statistics.specialCharactersWith')}</span>
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
    );
};

export default StatisticsFilters;
