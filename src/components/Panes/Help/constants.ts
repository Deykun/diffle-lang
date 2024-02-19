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
  cs: {
    first: {
      wordToGuess: 'příklad',
      words: ['hrát', 'shledanou', 'říká', 'pod', 'příklad'],
    },
    second: {
      wordToGuess: 'zpívat',
      words: ['kočky', 'vítej', 'netrpívá', 'zabit', 'zpívat'],
    },
  },
  de: {
    first: {
      wordToGuess: 'schmetterling',
      words: ['pfad', 'volant', 'pfuscht', 'samstag', 'schmetterling'],
    },
    second: {
      wordToGuess: 'schnecke',
      words: ['pirat', 'kaudern', 'kecker', 'setze', 'schnecke'],
    },
  },
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

