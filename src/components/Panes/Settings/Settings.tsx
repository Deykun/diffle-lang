import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode, Pane, PaneChange } from '@common-types';

import { useSelector, useDispatch } from '@store';
import { selectIsGameEnded } from '@store/selectors';
import { loseGame } from '@store/gameSlice';

import { getYesterdaysSeed } from '@utils/date';

import getWordToGuess from '@api/getWordToGuess'

import useScrollEffect from '@hooks/useScrollEffect';

import IconBin from '@components/Icons/IconBin';
import IconBook from '@components/Icons/IconBook';
import IconCircleTarget from '@components/Icons/IconCircleTarget';
import IconConstruction from '@components/Icons/IconConstruction';

import Button from '@components/Button/Button';

import './Settings.scss'

import SettingsModes from './SettingsModes';
import SettingsPreferences from './SettingsPreferences';
import SettingsSources from './SettingsSources';

interface Props {
    changePane: PaneChange,
}

const Settings = ({ changePane }: Props) => {
    const dispatch = useDispatch();
    const [yesterdayWord, setYesterdayWord] = useState('');
    const isGameEnded = useSelector(selectIsGameEnded);

    const { t } = useTranslation();

    useScrollEffect('top', []);

    useEffect(() => {
        const yesterdaysSeed = getYesterdaysSeed();

        getWordToGuess({ gameMode: GameMode.Daily, seedNumber: yesterdaysSeed }).then((dayWord) => {
            setYesterdayWord(dayWord);
        });
    }, []);

    const handleGiveUp = () => {
        dispatch(loseGame());
        changePane(Pane.Game);
    }

    return (
        <div className="settings">
            <ul>
                <li>
                    <button className="setting" onClick={() => changePane(Pane.Statistics)}>
                        <IconCircleTarget />
                        <span>{t('settings.statisticsTitle')}</span>
                        <span className={clsx('setting-label', 'position', 'construction')}><span>{t('settings.inDevelopment')}</span> <IconConstruction /></span>
                    </button>
                </li>
                <li>
                    <button className="setting" onClick={handleGiveUp} disabled={isGameEnded}>
                        <IconBin />
                        <span>{t('game.iGiveUp')}</span>
                    </button>
                </li>
            </ul>
            <SettingsModes changePane={changePane} />
            <SettingsPreferences />
            <footer>
                <SettingsSources />
                {yesterdayWord && (<>
                    <h2>{t('settings.lastDailyWordsTitle')}</h2>
                    <p>
                        {t('settings.lastDailyWordsYesterday', { word: yesterdayWord })}
                        <br /><br />
                        <Button
                          tagName="a"
                          href={`https://sjp.pl/${yesterdayWord}`}
                          target="blank"
                          isInverted
                        >
                            <IconBook />
                            <span>{t('common.checkInDictionary', { word: yesterdayWord })}</span>
                        </Button>
                    </p>
                </>)}
            </footer>
        </div>
    )
};

export default Settings;
