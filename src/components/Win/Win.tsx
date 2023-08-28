import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AffixStatus, GameMode } from '@common-types';

import { getNow } from '@utils/date';

import { useSelector, useDispatch } from '@store';
import { setToast } from '@store/appSlice';

import { setWordToGuess } from '@store/gameSlice'

import getWordToGuess from '@api/getWordToGuess'

import { copyMessage } from '@utils/copyMessage';

import IconBook from '@components/Icons/IconBook';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconGamepad from '@components/Icons/IconGamepad';
import IconMagic from '@components/Icons/IconMagic';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';

import './Win.scss';

const Win = () => {
    const dispatch = useDispatch();
    const shouldVibrate = useSelector(state => state.app.shouldVibrate);
    const gameMode = useSelector((state) => state.game.mode);
    const wordToGuess = useSelector((state) => state.game.wordToGuess);
    const guesses = useSelector((state) => state.game.guesses);
    const [isReseting, setIsReseting] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        if (shouldVibrate) {
            navigator?.vibrate(300);
        }
    }, [shouldVibrate])

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

    const { words, letters, subtotals } = useMemo(() => {
        const{ words, subtotals } = guesses.reduce((stack, { affixes }) => {
            const { subtotals: wordTotals } = affixes.reduce((stack, affix) => {
                if (affix.type === AffixStatus.Correct) {
                    stack.subtotals.correct += affix.text.length;
                }

                if (affix.type === AffixStatus.Position) {
                    stack.subtotals.position += affix.text.length;
                }

                if (affix.type === AffixStatus.Incorrect) {
                    stack.subtotals.incorrect += affix.text.length;
                }

                return stack;
            }, {
                subtotals: {
                    correct: 0,
                    position: 0,
                    incorrect: 0,
                }
            });

            stack.words += 1;
            stack.subtotals.correct += wordTotals.correct;
            stack.subtotals.position += wordTotals.position;
            stack.subtotals.incorrect += wordTotals.incorrect;

            stack

            return stack;
        }, {
            words: 0,
            subtotals: {
                correct: 0,
                position: 0,
                incorrect: 0,
            }
        });

        return {
            words,
            letters: subtotals.correct + subtotals.position + subtotals.incorrect,
            subtotals,
        }
    }, [guesses]);

    const handleCopy = useCallback(() => {
        const diffleUrl = location.href.split('?')[0];
        const { stamp } = getNow();
        const textToCopy = gameMode === GameMode.Daily ? `${stamp} – DIFFLE  🇵🇱
 
${words} ${t('win.wordsUsed', { postProcess: 'interval', count: words })} – ${letters} ${t('win.lettersUsed', { postProcess: 'interval', count: letters })}
🟢 ${subtotals.correct} 🟡 ${subtotals.position} ⚪ ${subtotals.incorrect}

${diffleUrl} #diffle`:
`« ${wordToGuess} » – DIFFLE  🇵🇱

${words} ${t('win.wordsUsed', { postProcess: 'interval', count: words })} – ${letters} ${t('win.lettersUsed', { postProcess: 'interval', count: letters })}
🟢 ${subtotals.correct} 🟡 ${subtotals.position} ⚪ ${subtotals.incorrect}

${diffleUrl} #diffle`;

        copyMessage(textToCopy);
        dispatch(setToast({ text: 'Skopiowano.' }));
    }, [gameMode, words, letters, t, subtotals.correct, subtotals.position, subtotals.incorrect, wordToGuess, dispatch]);

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
                <p className="total"><strong>{words}</strong> {t('win.wordsUsed', { postProcess: 'interval', count: words })}</p>
                <p className="total"><strong>{letters}</strong> {t('win.lettersUsed', { postProcess: 'interval', count: letters })}</p>
            </div>
            <div className="subtotals">
                <p className="subtotal correct"><span>{subtotals.correct}</span></p>
                <p className="subtotal position"><span>{subtotals.position}</span></p>
                <p className="subtotal incorrect"><span>{subtotals.incorrect}</span></p>
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
