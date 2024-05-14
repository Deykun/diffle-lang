import clsx from 'clsx';

import './AboutLanguageWordle.scss';

type Props = {
  word: string
  activeLetters: string[],
  green: number,
  orange: number,
  total: number,
};

const AboutLanguageWordleItem = ({
  word,
  activeLetters,
  green,
  orange,
  total,
}: Props) => {
  return (
      <p>
          <span className="about-language-wordle-word">
              {word.split('').map((letter, index) => (
                  <strong
                                // eslint-disable-next-line react/no-array-index-key
                    key={`${word}-${index}`}
                    className={clsx('about-language-small-key-cap', {
                      'about-language-wordle-letter-active': activeLetters[index] === letter,
                    })}
                  >
                      {letter.replace('ß', 'ẞ')}
                  </strong>
              ))}
          </span>
          {' '}
          <span className={clsx('about-language-word-value', 'about-language-word-value--correct')}>
              <span>
                  {((green / (total * 5)) * 100).toFixed(2)}
                  %
              </span>
          </span>
          {' + '}
          <span className={clsx('about-language-word-value', 'about-language-word-value--position')}>
              <span>
                  {((orange / (total * 5)) * 100).toFixed(2)}
                  %
              </span>
          </span>
          {' = '}
          <span className="about-language-word-value-total">
              {(((green + orange) / (total * 5)) * 100).toFixed(2)}
              %
          </span>
      </p>
  );
};

export default AboutLanguageWordleItem;
