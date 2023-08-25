import clsx from 'clsx';

import { GameMode } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';

import { getYesterdaysSeed } from '@utils/date';

import getWordToGuess from '@api/getWordToGuess'

import { setToast } from '@store/appSlice';
import { setGameMode, setWordToGuess } from '@store/gameSlice'

import useScrollEffect from '@hooks/useScrollEffect';

import IconBin from '@components/Icons/IconBin';
import IconBook from '@components/Icons/IconBook';
import IconBookAlt from '@components/Icons/IconBookAlt';
import IconConstruction from '@components/Icons/IconConstruction';
import IconInfinity from '@components/Icons/IconInfinity';
import IconChart from '@components/Icons/IconChart';
import IconDay from '@components/Icons/IconDay';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconGamepad from '@components/Icons/IconGamepad';
import IconGamepadAlt from '@components/Icons/IconGamepadAlt';
import IconGithub from '@components/Icons/IconGithub';
import IconIconmonstr from '@components/Icons/IconIconmonstr';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';

import './Settings.scss'
import { useCallback, useEffect, useState } from 'react';

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

    const handleChangeGameMode = useCallback((newGameMode: GameMode) => {
        localStorage.setItem(LOCAL_STORAGE.LAST_GAME_MODE, newGameMode);
        dispatch(setGameMode(newGameMode));
        dispatch(setWordToGuess(''));
        changePane('game');
    }, [changePane, dispatch]);

    const isDailyNotWon = !isWon && gameMode === GameMode.Daily;

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
                    <span>Sprawdź "{lastWord}" na SJP.PL</span>
                </Button>
            </p>}
            <ul>
                <li>
                    <button className="setting" disabled>
                        <IconChart />
                        <span>Statystyki</span>
                        <span className={clsx('setting-label', 'position', 'construction')}><span>w budowie</span> <IconConstruction /></span>
                    </button>
                </li>
                <li>
                    <button className="setting" onClick={handleGiveUpClick}>
                        <IconBin />
                        <span>Poddaję się</span>
                    </button>
                </li>
            </ul>
            <h2>Rodzaj gry</h2>
            <ul>
                <li>
                    <button
                      className={clsx('setting', { 'setting-active': gameMode === GameMode.Daily })}
                      onClick={() => handleChangeGameMode(GameMode.Daily)}
                    >
                        <IconDay />
                        <span>Codzienny</span>
                        {!isDailyNotWon && <span className={clsx('setting-label', 'correct')}><span>zaliczone</span> <IconFancyCheck /></span>}
                    </button>
                </li>
                <li>
                    <button
                      className={clsx('setting', { 'setting-active': gameMode === GameMode.Practice })}
                      disabled={isDailyNotWon}
                      onClick={() => handleChangeGameMode(GameMode.Practice)}
                    >
                        <IconInfinity />
                        <span>Ćwiczenia</span>
                        {isDailyNotWon && <span className={clsx('setting-label', 'incorrect')}><span>ukończ</span> <IconDay /></span>}
                    </button>
                </li>
                <li>
                    <button className={clsx('setting', { 'setting-active': gameMode === GameMode.Share })} disabled>
                        <IconShare />
                        <span>Udostępniony</span>
                        <span className={clsx('setting-label', 'position', 'construction')}><span>w budowie</span> <IconConstruction /></span>
                    </button>
                </li>
            </ul>
            <footer>
                <h2>Źródła</h2>
                <p>
                    Specjalne podziękowania. dla SJP i FreeDict.
                </p>
                <ul>
                    <li><a href="https://sjp.pl" target="blank">
                        <IconBookAlt /><span>sjp.pl - używane jako spellchecker</span></a>
                    </li>
                    <li>
                        <a href="https://freedict.org/" target="blank">
                            <IconBook /><span>freedict.org - do ustalenia lepszych haseł</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://iconmonstr.com/" target="blank">
                            <IconIconmonstr /><span>iconmonstr.com - ikonki</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.nytimes.com/games/wordle/index.html" target="blank">
                            <IconGamepadAlt /><span>oryginalne wordle</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://hedalu244.github.io/diffle/" target="blank">
                            <IconGamepad /><span>oryginalne diffle</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/Deykun/diffle-lang" target="blank">
                            <IconGithub /><span>repozytorium strony</span>
                        </a>
                    </li>
                </ul>
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
                            <span>Sprawdź "{yesterdayWord}" na SJP.PL</span>
                        </Button>
                    </p>
                </>)}
            </footer>
        </div>
    )
};

export default Settings;
