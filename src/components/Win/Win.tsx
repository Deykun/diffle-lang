import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import IconBook from '@components/Icons/IconBook';
import IconFancyCheck from '@components/Icons/IconFancyCheck';
import IconShare from '@components/Icons/IconShare';

import './Win.scss';

const Win = () => {
    const wordToGuess = useSelector((state) => state.game.wordToGuess);
    const guesses = useSelector((state) => state.game.guesses);

    console.log('guesses', guesses);

    const { words, letters } = useMemo(() => {
        return guesses.reduce((stack, { word }) => {
            stack.letters = stack.letters + word.length;
            stack.words += 1;

            return stack;
        }, { words: 0, letters: 0 });
    }, [guesses]);

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
            <button
              className="link-sjp"
            >
                <IconShare />
                Udostępnij wynik
            </button>
            <br />
            <br />
            <a
              className="link-sjp"
              href={`https://sjp.pl/${wordToGuess}`}
              target="blank"
            >
                <IconBook />
                Sprawdź "{wordToGuess}" na SJP.PL
            </a>
        </div>
    )
};

export default Win;
