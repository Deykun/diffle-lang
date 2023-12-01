import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GameMode } from '@common-types';

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
import IconGamepad from '@components/Icons/IconGamepad';
import IconMagic from '@components/Icons/IconMagic';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';

import './Win.scss';

const Win = () => {
    const dispatch = useDispatch();
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
        const textToCopy = gameMode === GameMode.Daily ? `${stamp} – DIFFLE  🇵🇱

${letters} ${t('win.lettersUsed', { postProcess: 'interval', count: letters })} ${t('win.in')} ${words} ${t('win.inWordsUsed', { postProcess: 'interval', count: words })}
🟢 ${subtotals.correct} 🟡 ${subtotals.position} ⚪ ${subtotals.incorrect} 🔴 ${subtotals.typedKnownIncorrect}

${diffleUrl} #diffle #difflepl`:
`« ${wordToGuess} » – DIFFLE  🇵🇱

${letters} ${t('win.lettersUsed', { postProcess: 'interval', count: letters })} ${t('win.in')} ${words} ${t('win.inWordsUsed', { postProcess: 'interval', count: words })}
🟢 ${subtotals.correct} 🟡 ${subtotals.position} ⚪ ${subtotals.incorrect} 🔴 ${subtotals.typedKnownIncorrect}

${diffleUrl} #diffle #difflepl`;

        copyMessage(textToCopy);
        dispatch(setToast({ text: 'Skopiowano.' }));
    }, [gameMode, letters, t, words, subtotals.correct, subtotals.position, subtotals.incorrect, subtotals.typedKnownIncorrect, wordToGuess, dispatch]);

    if (guesses.length === 0) {
        return null;
    }

    const hoursToNext = 24 - getNow().nowUTC.getHours() + 1;

    return (
        <div className="win">
            <h3 className="title">
                {guesses.length > 1 ? (<>
                    <span>{t('win.title')}</span>
                    <IconFancyCheck className="title-icon" />
                </>): (<>
                    <span>{t('win.titleCheater')}</span>
                    <IconMagic className="title-icon" />
                </>)}

            </h3>
            <div className="totals">
                <p className="total">
                    <strong>{letters}</strong>
                    {t('win.lettersUsed', { postProcess: 'interval', count: letters })}
                    {' '}
                    {t('win.in')}
                    {' '}
                    <strong>{words}</strong>
                    {t('win.inWordsUsed', { postProcess: 'interval', count: words })}
                </p>
            </div>
            <div className="subtotals">
                <p className="subtotal correct" aria-label={t('statistics.lettersCorrect')}>
                    <span>{subtotals.correct}</span>
                </p>
                <p className="subtotal position" aria-label={t('statistics.lettersPosition')}>
                    <span>{subtotals.position}</span>
                </p>
                <p className="subtotal incorrect" aria-label={t('statistics.lettersIncorrect')}>
                    <span>{subtotals.incorrect}</span>
                </p>
                <p className="subtotal incorrect typed" aria-label={t('statistics.lettersIncorrectAndTyped')}>
                    <span>{subtotals.typedKnownIncorrect}</span>
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
              isInverted
            >
                <IconBook />
                <span>{t('common.checkInDictionary', { word: wordToGuess })}</span>
            </Button>
            {gameMode === GameMode.Daily && (
                <p
                  className="next-word-tip"
                  dangerouslySetInnerHTML={{ __html: t('win.nextDaily', {
                        postProcess: 'interval',
                        count: hoursToNext,
                  })}}
                />
            )}
        </div>
    )
};

export default Win;
