import { Word, AffixStatus } from '@common-types';

export const HELP_WORDS: Word[] = [
    {
      word: 'ahoj',
      affixes: [
        {
          type: AffixStatus.Incorrect,
          text: 'a'
        },
        {
          type: AffixStatus.Incorrect,
          text: 'h'
        },
        {
          type: AffixStatus.Incorrect,
          text: 'o'
        },
        {
          type: AffixStatus.Incorrect,
          text: 'j'
        }
      ]
    },
    {
      word: 'prosta',
      affixes: [
        {
          type: AffixStatus.Correct,
          text: 'p'
        },
        {
          type: AffixStatus.Correct,
          text: 'r'
        },
        {
          type: AffixStatus.Incorrect,
          text: 'o'
        },
        {
          type: AffixStatus.Position,
          text: 's'
        },
        {
          type: AffixStatus.Incorrect,
          text: 't'
        },
        {
          type: AffixStatus.Incorrect,
          text: 'a'
        }
      ]
    },
    {
      word: 'tupet',
      affixes: [
        {
          type: AffixStatus.Incorrect,
          text: 't'
        },
        {
          type: AffixStatus.Correct,
          text: 'upe'
        },
        {
          type: AffixStatus.Incorrect,
          text: 't'
        }
      ]
    },
    {
      word: 'spór',
      affixes: [
        {
          type: AffixStatus.Correct,
          text: 's',
          isStart: true
        },
        {
          type: AffixStatus.Correct,
          text: 'p'
        },
        {
          type: AffixStatus.Incorrect,
          text: 'ó'
        },
        {
          type: AffixStatus.Correct,
          text: 'r',
          isEnd: true
        }
      ]
    },
    {
      word: 'super',
      affixes: [
        {
          type: AffixStatus.Correct,
          text: 'super',
          isStart: true,
          isEnd: true
        }
      ]
    }
];

export const HELP_WORDS_ALT: Word[] = [
  {
    word: 'hej',
    affixes: [
      {
        type: AffixStatus.Incorrect,
        text: 'h'
      },
      {
        type: AffixStatus.Incorrect,
        text: 'e'
      },
      {
        type: AffixStatus.Incorrect,
        text: 'j'
      }
    ]
  },
  {
    word: 'kraj',
    affixes: [
      {
        type: AffixStatus.Correct,
        text: 'k'
      },
      {
        type: AffixStatus.Position,
        text: 'r'
      },
      {
        type: AffixStatus.Correct,
        text: 'a'
      },
      {
        type: AffixStatus.Incorrect,
        text: 'j'
      }
    ]
  },
  {
    word: 'łatwo',
    affixes: [
      {
        type: AffixStatus.Correct,
        text: 'ła'
      },
      {
        type: AffixStatus.Incorrect,
        text: 't'
      },
      {
        type: AffixStatus.Incorrect,
        text: 'w'
      },
      {
        type: AffixStatus.Incorrect,
        text: 'o'
      }
    ]
  },
  {
    word: 'pęd',
    affixes: [
      {
        type: AffixStatus.Correct,
        text: 'p',
        isStart: true
      },
      {
        type: AffixStatus.Incorrect,
        text: 'ę'
      },
      {
        type: AffixStatus.Correct,
        text: 'd',
        isEnd: true
      }
    ]
  },
  {
    word: 'przykład',
    affixes: [
      {
        type: AffixStatus.Correct,
        text: 'przykład',
        isStart: true,
        isEnd: true
      }
    ]
  }
];
