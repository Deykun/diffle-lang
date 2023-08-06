import clsx from 'clsx';

import { GameMode } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';

import { setToast } from '@store/appSlice';
import { setGameMode, setWordToGuess } from '@store/gameSlice'

import useScrollEffect from '@hooks/useScrollEffect';

import IconBin from '@components/Icons/IconBin';
import IconBook from '@components/Icons/IconBook';
import IconInfinity from '@components/Icons/IconInfinity';
import IconChart from '@components/Icons/IconChart';
import IconDay from '@components/Icons/IconDay';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';

import './Settings.scss'
import { useCallback, useState } from 'react';

const Settings = () => {
    const dispatch = useDispatch();
    const [lastWord, setLastWord] = useState('');
    const wordToGuess = useSelector(state => state.game.wordToGuess);
    const gameMode = useSelector(state => state.game.mode);
    const guesses = useSelector(state => state.game.guesses);
    const isWon = useSelector(state => state.game.isWon);

    const canGiveUp = gameMode === GameMode.Practice && guesses.length > 0 && !isWon;

    useScrollEffect('top', []);

    const handleGiveUpClick = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE.TYPE_PRACTICE);
        
        setLastWord(wordToGuess);

        dispatch(setToast({ text: `"${wordToGuess.toUpperCase()}" to nieodgadnięte słowo.`, timeoutSeconds: 10 }));
        dispatch(setWordToGuess(''));
    }, [dispatch, wordToGuess]);

    const handleChangeGameMode = useCallback((newGameMode: GameMode) => {
        localStorage.setItem(LOCAL_STORAGE.LAST_GAME_MODE, newGameMode);
        dispatch(setGameMode(newGameMode));
        dispatch(setWordToGuess(''));
    }, [dispatch]);

    return (
        <div className="settings">
            <h1>Sekcja w budowie</h1>
            <p>W tym momencie można jeddynie się poddać.</p>
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
                    <button disabled>
                        <IconChart />
                        <span>Statystyki</span>
                    </button>
                </li>
                <li>
                    <button disabled={!canGiveUp} onClick={handleGiveUpClick}>
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
                    </button>
                </li>
                <li>
                    <button
                      className={clsx('setting', { 'setting-active': gameMode === GameMode.Practice })}
                      disabled={(!isWon && gameMode === GameMode.Daily)}
                      onClick={() => handleChangeGameMode(GameMode.Practice)}
                    >
                        <IconInfinity />
                        <span>Nieskończony</span>
                    </button>
                </li>
                <li>
                    <button className={clsx('setting', { 'setting-active': gameMode === GameMode.Share })} disabled>
                        <IconShare />
                        <span>Udostępniony</span>
                    </button>
                </li>
            </ul>
            <footer>
                <h2>Źródła</h2>
                <p>
                    Specjalne podziękowania. dla SJP i FreeDict.
                </p>
                <ul>
                    <li><a href="https://sjp.pl" target="blank">https://sjp.pl</a> - używane jako spellchecker</li>
                    <li><a href="https://freedict.org/" target="blank">ttps://freedict.org/</a> - do ustalenia lepszych haseł (bez dziwnnych odmian)</li>
                    <li><a href="https://iconmonstr.com/" target="blank">https://iconmonstr.com/</a> - ikonki</li>
                    <li><a href="https://www.nytimes.com/games/wordle/index.html" target="blank">https://www.nytimes.com/games/wordle/</a> - oryginalne wordle</li>
                    <li><a href="https://hedalu244.github.io/diffle/" target="blank">https://hedalu244.github.io/diffle/</a> - oryginalne diffle</li>
                </ul>
            </footer>
        </div>
    )
};

export default Settings;
