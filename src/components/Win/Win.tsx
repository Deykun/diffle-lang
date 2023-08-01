import { useCallback, useMemo } from 'react';

import { AffixStatus } from '@common-types';

import { useSelector, useDispatch } from '@store';
import { setToast } from '@store/appSlice';

import { setWordToGuess } from '@store/gameSlice'

import getWordToGuess from '@api/getWordToGuess'

import { copyMessage } from '@utils/copyMessage';

import IconBook from '@components/Icons/IconBook';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconGamepad from '@components/Icons/IconGamepad';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';

import './Win.scss';

const Win = () => {
    const dispatch = useDispatch();
    const wordToGuess = useSelector((state) => state.game.wordToGuess);
    const guesses = useSelector((state) => state.game.guesses);

    const handleNewGame = useCallback(() => {
        getWordToGuess().then(word => {
            dispatch(setWordToGuess(word));  
          });
    }, [dispatch]);

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

        const textToCopy = `DIFFLE 🇵🇱
« ${wordToGuess} »
Słowa: ${words} | Liter: ${letters}

🟢 ${subtotals.correct} 🟡 ${subtotals.position} ⚫ ${subtotals.incorrect}

${diffleUrl}`;

        copyMessage(textToCopy);
        dispatch(setToast({ text: 'Skopiowano.' }));
    }, [wordToGuess, words, letters, subtotals.correct, subtotals.position, subtotals.incorrect, dispatch]);

    if (guesses.length === 0) {
        return null;
    }

    const labelWords = words > 4 ? 'słów' : (words > 1) ? 'słowa' : 'słowo';
    const labelLetters = letters > 4 ? 'liter' : (letters > 1) ? 'litery' : 'litera';

    return (
        <div className="win">
            <h3 className="title">
                <span>Sukces</span>
                <IconFancyCheck className="title-icon" />
            </h3>
            <div className="totals">
                <p className="total"><strong>{words}</strong> {labelWords}</p>
                <p className="total"><strong>{letters}</strong> {labelLetters}</p>
            </div>
            <div className="subtotals">
                <p className="subtotal correct"><span>{subtotals.correct}</span></p>
                <p className="subtotal position"><span>{subtotals.position}</span></p>
                <p className="subtotal incorrect"><span>{subtotals.incorrect}</span></p>
            </div>
            <div className="actions">
                <Button
                  onClick={handleNewGame}
                >
                    <IconGamepad />
                    <span>Nowa gra</span>
                </Button>
                <Button
                  onClick={handleCopy}
                >
                    <IconShare />
                    <span>Skopiuj wynik</span>
                </Button>
            </div>
            <Button
              tagName="a"
              href={`https://sjp.pl/${wordToGuess}`}
              target="blank"
              isInverted
            >
                <IconBook />
                <span>Sprawdź "{wordToGuess}" na SJP.PL</span>
            </Button>
        </div>
    )
};

export default Win;
