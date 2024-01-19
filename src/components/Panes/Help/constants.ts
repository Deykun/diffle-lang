export const HELP_EXAMPLES_BY_LANG: {
  [key: string]: {
    first: {
      wordToGuess: string,
      words: string[],
    },
    second: {
      wordToGuess: string,
      words: string[],
    }
  }
} = {
  en: {
    first: {
      wordToGuess: 'great',
      words: ['hi', 'letter', 'bread', 'got', 'great'],
    },
    second: {
      wordToGuess: 'challenge',
      words: ['word', 'great', 'balls', 'curve', 'challenge'],
    },
  },
  pl: {
    first: {
      wordToGuess: 'super',
      words: ['ahoj', 'prosta', 'tupet', 'spór', 'super'],
    },
    second: {
      wordToGuess: 'przykład',
      words: ['hej', 'kraj', 'łatwo', 'pęd', 'przykład'],
    }
  }
};

