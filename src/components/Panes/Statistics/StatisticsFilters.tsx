import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode, Pane, PaneChange } from '@common-types';

// import { LOCAL_STORAGE } from '@const';
import { PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS } from '@const';

import { useSelector, useDispatch } from '@store';

import { getNow } from '@utils/date';
import { ModeFilter, CharactersFilter, LengthFilter, getStatisticForFilter, getStatisticCardDataFromStatistics } from '@utils/statistics';

import { setGameMode, setWordToGuess } from '@store/gameSlice'

import IconConstruction from '@components/Icons/IconConstruction';
import IconInfinity from '@components/Icons/IconInfinity';
import IconDay from '@components/Icons/IconDay';
import IconLayersAlt from '@components/Icons/IconLayersAlt';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconShare from '@components/Icons/IconShare';

import '../Settings/Settings.scss'

interface Props {
    // changePane: PaneChange,
}

const StatisticsFilters = ({ setStatisticData }: Props) => {
    const [modeFilter, setModeFilter] = useState<ModeFilter>(ModeFilter.Daily);
    const [charactersFilter, setModeCharactersFilter] = useState<CharactersFilter>(CharactersFilter.All);
    const [lengthFilter, setLengthFilter] = useState<LengthFilter>(LengthFilter.All);

    const { t } = useTranslation();

    useEffect(() => {
        const statistics = getStatisticForFilter({
            modeFilter,
            charactersFilter,
            lengthFilter,
        });

        const statisitcsData = getStatisticCardDataFromStatistics(statistics);

        setStatisticData(statisitcsData)
    }, [modeFilter, charactersFilter, setStatisticData, lengthFilter]);
    
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
                        <span>{t('statistics.specialCharactersWithout')}</span>
                    </button>
                </li>
                <li>
                    <button
                    className={clsx('setting', { 'setting-active': charactersFilter === CharactersFilter.Special })}
                    onClick={() => setModeCharactersFilter(CharactersFilter.Special)}
                    >
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
                        <span>{t('statistics.wordLengthShort', { to: PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS })}</span>
                    </button>
                </li>
                <li>
                    <button
                    className={clsx('setting', { 'setting-active': lengthFilter === LengthFilter.Long })}
                    onClick={() => setLengthFilter(LengthFilter.Long)}
                    >
                        <span>{t('statistics.wordLengthLong', { above: PASSWORD_IS_CONSIDER_LONG_AFTER_X_LATERS })}</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default StatisticsFilters;
