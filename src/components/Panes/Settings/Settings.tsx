import clsx from 'clsx';

import { GameMode } from '@common-types';

import { LOCAL_STORAGE } from '@const';

import { useSelector, useDispatch } from '@store';

import { setToast } from '@store/appSlice';
import { setWordToGuess } from '@store/gameSlice'

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
    const gameType = useSelector(state => state.game.type);
    const guesses = useSelector(state => state.game.guesses);
    const isWon = useSelector(state => state.game.isWon);

    const canGiveUp = gameType === GameMode.Practice && guesses.length > 0 && !isWon;

    const handleGiveUpClick = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE.TYPE_PRACTICE);
        
        setLastWord(wordToGuess);

        dispatch(setToast({ text: `"${wordToGuess.toUpperCase()}" to nieodgadnięte słowo.` }));
        dispatch(setWordToGuess(''));
    }, [dispatch, wordToGuess]);

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
                    <button className={clsx('setting', { 'setting-active': gameType === GameMode.Daily })} disabled>
                        <IconDay />
                        <span>Raz dziennie</span>
                    </button>
                </li>
                <li>
                    <button className={clsx('setting', { 'setting-active': gameType === GameMode.Practice })}>
                        <IconInfinity />
                        <span>Nieskończony</span>
                    </button>
                </li>
                <li>
                    <button className={clsx('setting', { 'setting-active': gameType === GameMode.Share })} disabled>
                        <IconShare />
                        <span>Udostępniony</span>
                    </button>
                </li>
            </ul>
        </div>
    )
};

export default Settings;
