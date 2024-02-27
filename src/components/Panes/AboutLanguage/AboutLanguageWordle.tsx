import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { DictionaryInfo, BestWordleType } from '@common-types';

import { useSelector } from '@store';

import { formatLargeNumber } from '@utils/format';

import GoToDictionaryButton from '@components/Dictionary/GoToDictionaryButton';

import AboutLanguageWordleFilters from './AboutLanguageWordleFilters';

import './AboutLanguageWordle.scss';

interface Props {
  data: DictionaryInfo
}

const AboutLanguageWordle = ({ data }: Props) => {
  const {
    spellchecker: {
      accepted: {
        allWordleWords,
      },
      letters: {
        wordle: letterPositions,
      },
      wordle,
    },
    meta,
  } = data;
  const gameLanguage = useSelector(state => state.game.language);
  const [filterGroupBy, setFilterGroupBy] = useState<BestWordleType>(BestWordleType.BestGreen1_5);

  const wordsData = wordle[filterGroupBy] || [];

  const activeLetters = useMemo(() => {
    return [
      Object.keys(letterPositions[0]).slice(0, 1)[0],
      Object.keys(letterPositions[1]).slice(0, 1)[0],
      Object.keys(letterPositions[2]).slice(0, 1)[0],
      Object.keys(letterPositions[3]).slice(0, 1)[0],
      Object.keys(letterPositions[4]).slice(0, 1)[0],
    ];
  }, [letterPositions]);

  useEffect(() => {
    setFilterGroupBy(BestWordleType.BestGreen1_5);
  }, [gameLanguage]);

  const { t } = useTranslation();

  let sourceHTML = `<a target="_blank" rel="noopener noreferrer" href="${meta.spellchecker.url}">${meta.spellchecker.fullName}</a>`;

  if (meta.spellcheckerAlt?.url) {
    sourceHTML += ` & <a target="_blank" rel="noopener noreferrer" href="${meta.spellcheckerAlt.url}">${meta.spellcheckerAlt.fullName}</a>`;
  }

  if (wordsData.length === 0) {
    return null;
  }

  const firstWord = wordsData[0].word;

  return (
      <section className="about-language-wordle">
          <h2>{t('statistics.bestWordleWordTitle')}</h2>
          <br />
          <AboutLanguageWordleFilters filterGroupBy={filterGroupBy} setFilterGroupBy={setFilterGroupBy} />
          <br />
          <p className="about-language-wordle-word-title">{t('statistics.bestWordleWordTitle')}</p>
          <br />
          <p>
              <span className="about-language-wordle-best-word">
                  {firstWord.split('').map((letter, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <strong key={`${letter}-${filterGroupBy}-${index}`} className="about-language-small-key-cap">
                          {/* Both text-transform: uppercase and .toUppercase() replace ß with SS */}
                          {letter.replace('ß', 'ẞ')}
                      </strong>
                  ))}
              </span>
          </p>
          <br />
          <div>
              <p>{t('statistics.bestWordleWordPopularLettersTitle')}</p>
              <ul className="about-language-wordle-positions-list">
                  {[0, 1, 2, 3, 4].map(index => (
                      <li key={index}>
                          <strong>
                              {index + 1}
                          </strong>
                          {' '}
                          {Object.entries(letterPositions[index]).slice(0, 5).map(
                            ([letter, value]) => (
                                <strong
                                  className={clsx('about-language-small-key-cap', 'has-tooltip', {
                                    'about-language-wordle-positions-active-letter': firstWord.at(index) === letter,
                                  })}
                                >
                                    {/* Both text-transform: uppercase and .toUppercase() replace ß with SS */}
                                    {letter.replace('ß', 'ẞ')}
                                    <span className="tooltip">
                                        <strong className="text-uppercase">
                                            {letter.replace('ß', 'ẞ')}
                                        </strong>
                                        {' '}
                                        {' - '}
                                        {((value / allWordleWords) * 100).toFixed(1)}
                                        {'% '}
                                        {t('end.wordsUsed', { count: 100 })}
                                    </span>
                                </strong>
                            ),
                          )}
                      </li>
                  ))}
              </ul>
          </div>
          <div className="about-language-words-list">
              {wordsData.map(({
                word,
                result: {
                  total, green, orange,
                },
              }) => (
                  <p key={word}>
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
              ))}
          </div>
          <br />
          <GoToDictionaryButton word={firstWord} />
          <br />
          <p
            className="about-language-wordle-footer"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t('statistics.basedOn', {
                product: '',
                words: `<span>${formatLargeNumber(allWordleWords)}</span>`,
                source: sourceHTML,
              }),
            }}
          />
      </section>
  );
};

export default AboutLanguageWordle;
