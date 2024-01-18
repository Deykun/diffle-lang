import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode, Pane } from '@common-types';

import { useSelector, useDispatch } from '@store';
import { loseGame } from '@store/gameSlice';
import { selectGameLanguage, selectIsGameEnded } from '@store/selectors';

import { getYesterdaysSeed } from '@utils/date';

import getWordToGuess from '@api/getWordToGuess'

import useScrollEffect from '@hooks/useScrollEffect';
import usePanes from '@hooks/usePanes';
import useEnhancedDetails from '@hooks/useEnhancedDetails';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';
import IconBandage from '@components/Icons/IconBandage';
import IconBook from '@components/Icons/IconBook';
import IconDiffleChart from '@components/Icons/IconDiffleChart';
import IconGamepad from '@components/Icons/IconGamepad';
import IconInfinity from '@components/Icons/IconInfinity';

import Button from '@components/Button/Button';

import './Settings.scss'

import SettingsModes from './SettingsModes';
import SettingsPreferences from './SettingsPreferences';
import SettingsSources from './SettingsSources';


const Settings = () => {
    const dispatch = useDispatch();
    const [yesterdayWord, setYesterdayWord] = useState('');
    const gameLanguage = useSelector((state) => state.game.language);
    const gameMode = useSelector(state => state.game.mode);
    const isGameEnded = useSelector(selectIsGameEnded);

    const isGivingUpDisabled = isGameEnded || gameMode !== GameMode.Practice;

    const { t } = useTranslation();
    const { changePane } = usePanes();

    useScrollEffect('top', []);

    const { handleClickSummary } = useEnhancedDetails();

    useEffect(() => {
        if (gameLanguage) {
            const yesterdaysSeed = getYesterdaysSeed();

            getWordToGuess({ gameMode: GameMode.Daily, gameLanguage, seedNumber: yesterdaysSeed }).then((dayWord) => {
                setYesterdayWord(dayWord);
            });
        }
    }, [gameLanguage]);

    const handleGiveUp = () => {
        dispatch(loseGame());
        changePane(Pane.Game);
    }

    return (
        <div className="settings">
            <ul>
                <li>
                    <button className="setting" onClick={() => changePane(Pane.Statistics)}>
                        <IconDiffleChart />
                        <span>{t('settings.statisticsTitle')}</span>
                    </button>
                </li>
                {gameMode === GameMode.Practice && isGivingUpDisabled ? (<li>
                    <button className="setting" onClick={() => changePane(Pane.Game)}>
                        <IconGamepad />
                        <span>{t('common.play')}</span>
                    </button>
                </li>) : (<li>
                    <button className="setting" onClick={handleGiveUp} disabled={isGivingUpDisabled}>
                        <IconBandage />
                        <span>{t('game.iGiveUp')}</span>
                        {gameMode !== GameMode.Practice && (
                            <span className={clsx('setting-label', 'info', 'mode')}>
                                <span>{t('settings.onlyIn')}</span>
                                <IconInfinity />
                            </span> 
                        )}
                    </button>
                </li>)}
            </ul>
            <SettingsModes changePane={changePane} />
            <details>
                <summary onClick={handleClickSummary}>
                    <h2>{t('settings.lastDailyWordsTitle')}</h2>
                    <IconAnimatedCaret className="details-icon" />
                </summary>
                {yesterdayWord && (<div className="details-content">
                    <p>
                        {t('settings.lastDailyWordsYesterday', { word: yesterdayWord })}
                    </p>
                    <Button
                        tagName="a"
                        href={`https://sjp.pl/${yesterdayWord}`}
                        target="blank"
                        rel="noopener noreferrer"
                        isInverted
                    >
                        <IconBook />
                        <span>{t('common.checkInDictionary', { word: yesterdayWord })}</span>
                    </Button>
                </div>)}
            </details>
            <SettingsPreferences />
            <footer>
                <SettingsSources />
            </footer>
        </div>
    )
};

export default Settings;
