import clsx from 'clsx';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Word as WordInterface, AffixStatus, GameMode, GameStatus } from '@common-types';

import { getNow } from '@utils/date';

import { useSelector, useDispatch } from '@store';
import { setToast } from '@store/appSlice';
import { selectGuessesStatsForLetters } from '@store/selectors';

import { setWordToGuess } from '@store/gameSlice'

import getWordToGuess from '@api/getWordToGuess'

import { copyMessage } from '@utils/copyMessage';

import useVibrate from '@hooks/useVibrate';

import IconBook from '@components/Icons/IconBook';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconFancyThumbDown from '@components/Icons/IconFancyThumbDown';
import IconGamepad from '@components/Icons/IconGamepad';
import IconMagic from '@components/Icons/IconMagic';
import IconShare from '@components/Icons/IconShare';

import Word from '@components/Words/Word';
import Button from '@components/Button/Button';

import './EndResult.scss';

const EndResult = () => {
    const dispatch = useDispatch();
    const endStatus = useSelector((state) => state.game.status);
    const gameMode = useSelector((state) => state.game.mode);
    const wordToGuess = useSelector((state) => state.game.wordToGuess);
    const guesses = useSelector((state) => state.game.guesses);
    const { words, letters, subtotals } = useSelector(selectGuessesStatsForLetters);
    const [isReseting, setIsReseting] = useState(false);

    const { t } = useTranslation();

    const { vibrate } = useVibrate();

    useEffect(() => {
        vibrate({ duration: 100 });
    }, [vibrate]);

    const lostWord: WordInterface = useMemo(() => {
        const affixes = [{
            type: AffixStatus.Incorrect,
            text: wordToGuess,
            isStart: true,
            isEnd: true,
        }];

        return {
            word: wordToGuess,
            affixes,
        };
    }, [wordToGuess]);

    const handleNewGame = useCallback(() => {
        if (!isReseting) {
            setIsReseting(true);
            getWordToGuess({ gameMode }).then(word => {
                return dispatch(setWordToGuess(word));  
            }).finally(() => {
                setIsReseting(false);
            });
        }
    }, [dispatch, gameMode, isReseting]);

    const handleCopy = useCallback(() => {
        const diffleUrl = location.href.split('?')[0];
        const { stamp } = getNow();

        const isLost = endStatus === GameStatus.Lost;

        const copyTitle = gameMode === GameMode.Daily ? `${stamp} – 🇵🇱 #diffle` : `« ${wordToGuess} » – 🇵🇱 #diffle`;
        const copySubtotals = `🟢 ${subtotals.correct}  🟡 ${subtotals.position}  ⚪ ${subtotals.incorrect}  🔴 ${subtotals.typedKnownIncorrect}`;

        if (isLost) {
            copyMessage(`${copyTitle}

🏳️ ${t('end.lostIn')} ${words} ${t('end.inWordsUsed', { postProcess: 'interval', count: words })} (${letters} ${t('end.lettersUsedShort')})
${copySubtotals}
            
${diffleUrl}`);
        } else {
            copyMessage(`${copyTitle}

${letters} ${t('end.lettersUsed', { postProcess: 'interval', count: letters })} ${t('end.in')} ${words} ${t('end.inWordsUsed', { postProcess: 'interval', count: words })}
${copySubtotals}

${diffleUrl}`);
        }

        dispatch(setToast({ text: 'common.copied' }));
    }, [gameMode, endStatus, letters, t, words, subtotals.correct, subtotals.position, subtotals.incorrect, subtotals.typedKnownIncorrect, wordToGuess, dispatch]);

    if (guesses.length === 0) {
        return null;
    }

    const hoursToNext = 24 - getNow().nowUTC.getHours() + 1;

    return (
        <>
            <div className={clsx('end-result', endStatus)}>
                <h3 className="title">
                    {endStatus === GameStatus.Lost && (<>
                        <span>{t('end.titleLost')}</span>
                        <IconFancyThumbDown className="title-icon" />
                    </>)}
                    {endStatus === GameStatus.Won && (<>
                        {guesses.length > 1 ? (<>
                            <span>{t('end.titleWon')}</span>
                            <IconFancyCheck className="title-icon" />
                        </>): (<>
                            <span>{t('end.titleCheater')}</span>
                            <IconMagic className={clsx('title-icon', 'title-icon--magic')} />
                        </>)}
                    </>)}
                </h3>
                <div className="totals">
                    <div className="total">
                        {endStatus === GameStatus.Lost && (<>
                            {t('end.winningWord')}
                            <div className="lost-word-wrapper">
                                <Word guess={lostWord} />
                            </div>
                        </>)}
                        {endStatus === GameStatus.Won && (<>
                            <strong>{letters}</strong>
                            {' '}
                            {t('end.lettersUsed', { postProcess: 'interval', count: letters })}
                            {' '}
                            {t('end.in')}
                            {' '}
                            <strong>{words}</strong>
                            {' '}
                            {t('end.inWordsUsed', { postProcess: 'interval', count: words })}
                        </>)}
                    </div>
                </div>
                <div className="subtotals">
                    <p className="subtotal correct has-tooltip has-tooltip-from-left">
                        <span>{subtotals.correct}</span>
                        <span className="tooltip">{t('statistics.lettersCorrect')}</span>
                    </p>
                    <p className="subtotal position has-tooltip">
                        <span>{subtotals.position}</span>
                        <span className="tooltip">{t('statistics.lettersPosition')}</span>
                    </p>
                    <p className="subtotal incorrect has-tooltip">
                        <span>{subtotals.incorrect}</span>
                        <span className="tooltip">{t('statistics.lettersIncorrect')}</span>
                    </p>
                    <p className="subtotal incorrect typed has-tooltip has-tooltip-from-right">
                        <span>{subtotals.typedKnownIncorrect}</span>
                        <span className="tooltip">{t('statistics.lettersIncorrectAndTyped')}</span>
                    </p>
                </div>
                <div className="actions">
                    {gameMode === GameMode.Practice && (
                        <Button
                            onClick={handleNewGame}
                            isLoading={isReseting}
                        >
                            <IconGamepad />
                            <span>{t('common.newGame')}</span>
                        </Button>
                    )}
                    <Button
                    onClick={handleCopy}
                    >
                        <IconShare />
                        <span>{t('common.copyResult')}</span>
                    </Button>
                </div>
                <Button
                    tagName="a"
                    href={`https://sjp.pl/${wordToGuess}`}
                    target="blank"
                    rel="noopener noreferrer"
                    isInverted
                >
                    <IconBook />
                    <span>{t('common.checkInDictionary', { word: wordToGuess })}</span>
                </Button>
                {gameMode === GameMode.Daily && (
                    <p
                        className="next-word-tip"
                        dangerouslySetInnerHTML={{ __html: t('end.nextDaily', {
                            postProcess: 'interval',
                            count: hoursToNext,
                        })}}
                    />
                )}
            </div>
        </>
    )
};

export default EndResult;
