import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode, Pane, PaneChange } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';

import { getNow } from '@utils/date';

import { setGameMode, setWordToGuess } from '@store/gameSlice'

import IconConstruction from '@components/Icons/IconConstruction';
import IconInfinity from '@components/Icons/IconInfinity';
import IconDay from '@components/Icons/IconDay';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconShare from '@components/Icons/IconShare';

import '../Settings/Settings.scss'

interface Props {
    changePane: PaneChange,
}

enum ModeFilter {
    All = 'all',
    Daily = 'daily',
    Practice = 'practice',
}

enum CharactersFilter {
    All = 'all',
    NoSpecial = 'noSpecial',
    Special = 'onlySpecial',
}

const StatisticsFilters = ({ changePane }: Props) => {
    const [modeFilter, setModeFilter] = useState<ModeFilter>(ModeFilter.Daily);
    const [modeCharactersFilter, setModeCharactersFilter] = useState<CharactersFilter>(CharactersFilter.All);

    const { t } = useTranslation();
    
    return (
        <div>
            <h2>{t('settings.gameModeTitle')}</h2>
            <ul>
                <li>
                    <button
                        className={clsx('setting', { 'setting-active': modeFilter === ModeFilter.All })}
                          onClick={() => setModeFilter(ModeFilter.All)}
                        >
                        {/* <IconDay /> */}
                        <span>{t('settings.statisticsFilterAll')}</span>
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
            <h2>{t('settings.gameModeTitle')}</h2>
            <ul>
                <li>
                    <button
                        className={clsx('setting', { 'setting-active': modeCharactersFilter === CharactersFilter.All })}
                          onClick={() => setModeCharactersFilter(CharactersFilter.All)}
                        >
                        {/* <IconDay /> */}
                        <span>{t('settings.statisticsFilterAll')}</span>
                    </button>
                </li>
                <li>
                    <button
                    className={clsx('setting', { 'setting-active': modeCharactersFilter === CharactersFilter.NoSpecial })}
                    onClick={() => setModeCharactersFilter(CharactersFilter.NoSpecial)}
                    >
                        <IconDay />
                        {/* <span>{t('game.modeDaily')}</span> */}
                        <span>z polskimi znakami</span>
                    </button>
                </li>
                <li>
                    <button
                    className={clsx('setting', { 'setting-active': modeCharactersFilter === CharactersFilter.Special })}
                    onClick={() => setModeCharactersFilter(CharactersFilter.Special)}
                    >
                        <IconInfinity />
                        <span>{t('game.modePractice')}</span>
                        <span>bez polskich znaków</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default StatisticsFilters;
