import clsx from 'clsx';
import { useCallback } from 'react';
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

import './Settings.scss'

interface Props {
    changePane: PaneChange,
}

const SettingsModes = ({ changePane }: Props) => {
    const dispatch = useDispatch();
    const gameMode = useSelector(state => state.game.mode);
    const isWon = useSelector(state => state.game.isWon);

    const { t } = useTranslation();

    const handleChangeGameMode = useCallback((newGameMode: GameMode) => {
        localStorage.setItem(LOCAL_STORAGE.LAST_GAME_MODE, newGameMode);
        dispatch(setGameMode(newGameMode));
        dispatch(setWordToGuess(''));
        changePane(Pane.Game);
    }, [changePane, dispatch]);

    const shouldShowCheckedDaily = gameMode !== GameMode.Daily || isWon;
    const shouldShowTimeForDaily = gameMode === GameMode.Daily && isWon;

    return (
        <>
            <h2>{t('settings.gameModeTitle')}</h2>
            <ul>
                <li>
                    <button
                      className={clsx('setting', { 'setting-active': gameMode === GameMode.Daily })}
                      onClick={() => handleChangeGameMode(GameMode.Daily)}
                    >
                        <IconDay />
                        <span>{t('game.modeDaily')}</span>
                        {shouldShowCheckedDaily && !shouldShowTimeForDaily && <span className={clsx('setting-label', 'correct')}><span>zaliczony</span> <IconFancyCheck /></span>}
                        {shouldShowTimeForDaily && <span className={clsx('setting-label', 'correct')}>
                            <span>{t('win.nextDailyShort', { count: 24 - getNow().nowUTC.getHours() + 1 })}</span>
                            <IconFancyCheck />
                        </span>}
                    </button>
                </li>
                <li>
                    <button
                      className={clsx('setting', { 'setting-active': gameMode === GameMode.Practice })}
                      disabled={!shouldShowCheckedDaily}
                      onClick={() => handleChangeGameMode(GameMode.Practice)}
                    >
                        <IconInfinity />
                        <span>{t('game.modePractice')}</span>
                        {!shouldShowCheckedDaily && <span className={clsx('setting-label', 'incorrect')}><span>{t('settings.labelFinishGame')}</span> <IconDay /></span>}
                    </button>
                </li>
                <li>
                    <button className={clsx('setting', { 'setting-active': gameMode === GameMode.Share })} disabled>
                        <IconShare />
                        <span>{t('game.modeShare')}</span>
                        <span className={clsx('setting-label', 'position', 'construction')}><span>{t('settings.inDevelopment')}</span> <IconConstruction /></span>
                    </button>
                </li>
            </ul>
        </>
    )
};

export default SettingsModes;