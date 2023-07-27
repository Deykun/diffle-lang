export const HELP_WORDS = [
    {
      word: 'ahoj',
      affixes: [
        {
          type: 'incorrect',
          text: 'a'
        },
        {
          type: 'incorrect',
          text: 'h'
        },
        {
          type: 'incorrect',
          text: 'o'
        },
        {
          type: 'incorrect',
          text: 'j'
        }
      ]
    },
    {
      word: 'prosta',
      affixes: [
        {
          type: 'correct',
          text: 'p'
        },
        {
          type: 'correct',
          text: 'r'
        },
        {
          type: 'incorrect',
          text: 'o'
        },
        {
          type: 'position',
          text: 's'
        },
        {
          type: 'incorrect',
          text: 't'
        },
        {
          type: 'incorrect',
          text: 'a'
        }
      ]
    },
    {
      word: 'tupet',
      affixes: [
        {
          type: 'incorrect',
          text: 't'
        },
        {
          type: 'correct',
          text: 'upe'
        },
        {
          type: 'incorrect',
          text: 't'
        }
      ]
    },
    {
      word: 'spór',
      affixes: [
        {
          type: 'correct',
          text: 's',
          isStart: true
        },
        {
          type: 'correct',
          text: 'p'
        },
        {
          type: 'incorrect',
          text: 'ó'
        },
        {
          type: 'correct',
          text: 'r',
          isEnd: true
        }
      ]
    },
    {
      word: 'super',
      affixes: [
        {
          type: 'correct',
          text: 'super',
          isStart: true,
          isEnd: true
        }
      ]
    }
];
