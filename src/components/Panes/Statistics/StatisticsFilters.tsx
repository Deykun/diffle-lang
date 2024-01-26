import clsx from 'clsx';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS } from '@const';

import { useSelector } from '@store';
import {
    selectGameLanguageKeyboardInfo,
} from '@store/selectors';

import {
    keepIfInEnum
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
import useEffectChange from "@hooks/useEffectChange";

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';
import IconDay from '@components/Icons/IconDay';
import IconFlag from '@components/Icons/IconFlag';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconInfinity from '@components/Icons/IconInfinity';
import IconLayersAlt from '@components/Icons/IconLayersAlt';
import IconRulerSmall from '@components/Icons/IconRulerSmall';
import IconRulerBig from '@components/Icons/IconRulerBig';

import { INITIAL_FILTERS } from './constants';

import '../Settings/Settings.scss'

interface Props {
    setFiltersData: Dispatch<SetStateAction<Filters>>
}

const StatisticsFilters = ({ setFiltersData }: Props) => {
    const { paneParams: {
            modeFilter: paneModeFilter = '',
        }
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

        setFiltersData(filtersData);
    }, [modeFilter, charactersFilter, lengthFilter, setFiltersData]);
    
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
                {hasLanguageSpecialCharacters && (
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
                )}
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
                                __html: t('statistics.wordLengthShort', { to: WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS })
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
                                __html: t('statistics.wordLengthLong', { above: WINNING_WORD_IS_CONSIDER_LONG_AFTER_X_LATERS })
                            }} />
                        </button>
                    </li>
                </ul>
            </div>
        </details>
    );
};

export default StatisticsFilters;
