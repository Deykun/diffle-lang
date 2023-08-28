import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';

import { getYesterdaysSeed } from '@utils/date';

import getWordToGuess from '@api/getWordToGuess'

import { setToast } from '@store/appSlice';
import { setWordToGuess } from '@store/gameSlice'

import useScrollEffect from '@hooks/useScrollEffect';

import IconBin from '@components/Icons/IconBin';
import IconBook from '@components/Icons/IconBook';
import IconConstruction from '@components/Icons/IconConstruction';
import IconChart from '@components/Icons/IconChart';

import Button from '@components/Button/Button';

import './Settings.scss'

import SettingsModes from './SettingsModes';
import SettingsPreferences from './SettingsPreferences';
import SettingsSources from './SettingsSources';

interface Props {
    changePane: (pane: string) => void;
}

const Settings = ({ changePane }: Props) => {
    const dispatch = useDispatch();
    const [lastWord, setLastWord] = useState('');
    const [yesterdayWord, setYesterdayWord] = useState('');
    const wordToGuess = useSelector(state => state.game.wordToGuess);
    const gameMode = useSelector(state => state.game.mode);
    const guesses = useSelector(state => state.game.guesses);
    const isWon = useSelector(state => state.game.isWon);

    const { t } = useTranslation();

    const canGiveUp = gameMode === GameMode.Practice && guesses.length > 0 && !isWon;

    useScrollEffect('top', []);

    useEffect(() => {
        const yesterdaysSeed = getYesterdaysSeed();

        getWordToGuess({ gameMode: GameMode.Daily, seedNumber: yesterdaysSeed }).then((dayWord) => {
            setYesterdayWord(dayWord);
        });
    }, []);

    const handleGiveUpClick = useCallback(() => {
        if (!canGiveUp) {
            dispatch(setToast({ text: `Możesz się poddać tylko w trybie ćwiczenia po wpisaniu chociaż jednego słowa.`, timeoutSeconds: 5 }));

            return;
        }

        localStorage.removeItem(LOCAL_STORAGE.TYPE_PRACTICE);
        
        setLastWord(wordToGuess);

        dispatch(setToast({ text: `"${wordToGuess.toUpperCase()}" to nieodgadnięte słowo.`, timeoutSeconds: 5 }));
        dispatch(setWordToGuess(''));
    }, [dispatch, canGiveUp, wordToGuess]);

    return (
        <div className="settings">
            {lastWord && <p>
                <Button
                  tagName="a"
                  href={`https://sjp.pl/${lastWord}`}
                  target="blank"
                  isInverted
                >
                    <IconBook />
                    <span>{t('common.checkInDictionary', { word: lastWord })}</span>
                </Button>
            </p>}
            <ul>
                <li>
                    <button className="setting" disabled>
                        <IconChart />
                        <span>{t('settings.statisticsTitle')}</span>
                        <span className={clsx('setting-label', 'position', 'construction')}><span>{t('settings.inDevelopment')}</span> <IconConstruction /></span>
                    </button>
                </li>
                <li>
                    <button className="setting" onClick={handleGiveUpClick} disabled={isWon}>
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
                    <h2>Wczoraj</h2>
                    <p>
                        Wczorajsze hasło w trybie codziennym to "{yesterdayWord}".
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
