import { useCallback, useMemo } from 'react';

import { AffixStatus } from '@common-types';

import { useSelector } from '@store';

import { copyMessage } from '@utils/copyMessage';

import IconBook from '@components/Icons/IconBook';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';

import './Win.scss';

const Win = () => {
    const wordToGuess = useSelector((state) => state.game.wordToGuess);
    const guesses = useSelector((state) => state.game.guesses);

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
    }, [wordToGuess, words, letters, subtotals]);

    if (guesses.length === 0) {
        return null;
    }

    return (
        <div className="win">
            <h3 className="title">
                <span>Wygrana</span>
                <IconFancyCheck className="title-icon" />
            </h3>
            <div className="totals">
                <p className="total"><strong>{words}</strong> słów</p>
                <p className="total"><strong>{letters}</strong> liter</p>
            </div>
            <div className="subtotals">
                <p className="subtotal correct"><span>{subtotals.correct}</span></p>
                <p className="subtotal position"><span>{subtotals.position}</span></p>
                <p className="subtotal incorrect"><span>{subtotals.incorrect}</span></p>
            </div>
            <Button
              onClick={handleCopy}
            >
                <IconShare />
                Skopiuj wynik
            </Button>
            <br />
            <br />
            <Button
              href={`https://sjp.pl/${wordToGuess}`}
              target="blank"
            >
                <IconBook />
                Sprawdź "{wordToGuess}" na SJP.PL
            </Button>
        </div>
    )
};

export default Win;
