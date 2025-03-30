import { useEffect } from 'react';
import { GameStatus } from '@common-types';
import { useSelector } from '@store';
import { selectWordToSubmit } from '@store/selectors';

export default function usePrimaAprilisJokeIfNeeded() {
  const status = useSelector(state => state.game.status);
  const guessesLenght = useSelector(state => state.game.guesses.length);
  const wordToSubmit = useSelector(selectWordToSubmit);
  const today = useSelector(state => state.game.today);
  const todayWithoutYear = today
    .split('.')
    .filter((_, index) => index !== 2)
    .join('.');
  const shouldAddScript = todayWithoutYear === '01.04';

  useEffect(() => {
    const wasJokeAdded = Boolean(document.getElementById('prima-aprilis-joke'));

    if (shouldAddScript && !wasJokeAdded) {
      const link = document.createElement('link');
      link.id = 'prima-aprilis-joke';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = '/diffle-lang/prima-aprilis/fake-hieroglyphs.css';

      document.getElementsByTagName('head')[0]?.appendChild(link);
    }

    if (!shouldAddScript && wasJokeAdded) {
      document.getElementById('prima-aprilis-joke')?.remove();
    }

    return () => {
      document.getElementById('prima-aprilis-joke')?.remove();
    };
  }, [shouldAddScript]);

  useEffect(() => {
    if (shouldAddScript) {
      const moreThan0Guesses = guessesLenght > 0;
      const emptyWordToSubmit = wordToSubmit.length === 0;
      const validStatus = [GameStatus.Guessing, GameStatus.Won, GameStatus.Lost].includes(status);

      const shouldUseJoke = moreThan0Guesses && emptyWordToSubmit && validStatus;
      document.body.setAttribute('data-prima-aprilis', shouldUseJoke ? 'egypt' : '');
    }
  }, [shouldAddScript, status, guessesLenght, wordToSubmit.length]);
}
