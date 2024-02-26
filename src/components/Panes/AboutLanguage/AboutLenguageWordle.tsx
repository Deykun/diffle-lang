import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { DictionaryInfo, DictionaryInfoLetters, ToastType } from '@common-types';

import { capitalize } from '@utils/format';

import useEnhancedDetails from '@hooks/useEnhancedDetails';

import IconAnimatedCaret from '@components/Icons/IconAnimatedCaret';

import Button from '@components/Button/Button';
import KeyboardHeatmap from '@components/Charts/KeyboardHeatmap';

import './AboutLenguageWordle.scss';

interface Props {
  data: DictionaryInfo
}

const AboutLenguageWordle = ({ data }: Props) => {
  const {
    spellchecker: {
      accepted: {
        all,
        allWordleWords,
      },
      letters: {
        inWordsWordle,
        wordle: letterPositions,
      },
      wordle,
    },
  } = data;
  const [filterGroupBy, setFilterGroupBy] = useState<'inWords' | 'letterPosition'>('letterPosition');

  const wordsData = wordle[filterGroupBy];

  const activeLetters = useMemo(() => {
    if (filterGroupBy === 'inWords') {
      const firstLetter = Object.keys(inWordsWordle).slice(0, 1)[0];

      return [
        firstLetter,
        firstLetter,
        firstLetter,
        firstLetter,
        firstLetter,
      ];
    }

    return [
      Object.keys(letterPositions[0]).slice(0, 1)[0],
      Object.keys(letterPositions[1]).slice(0, 1)[0],
      Object.keys(letterPositions[2]).slice(0, 1)[0],
      Object.keys(letterPositions[3]).slice(0, 1)[0],
      Object.keys(letterPositions[4]).slice(0, 1)[0],
    ];
  }, [wordsData, filterGroupBy]);

  const { handleClickSummary } = useEnhancedDetails();

  const { t } = useTranslation();

  if (wordsData.length === 0) {
    return null;
  }

  const firstWord = wordsData[0].word;

  return (
      <section className="about-language-wordle">
          <h2>Najlepsze słowo startowe w Wordle</h2>
          <nav className="heatmap-keyboard-filters">
              {['inWords', 'letterPosition'].map(filter => (
                  <Button
                    key={filter}
                    onClick={() => setFilterGroupBy(filter)}
                    isInverted
                    hasBorder={false}
                    isText={filterGroupBy !== filter}
                  >
                      {t(`statistics.filter${capitalize(filter)}`)}
                  </Button>
              ))}
          </nav>
          <p>
              <span className="about-language-wordle-best-word">
                  {firstWord.split('').map(letter => (
                      <strong key={letter} className="about-language-small-key-cap">
                          {/* Both text-transform: uppercase and .toUppercase() replace ß with SS */}
                          {letter.replace('ß', 'ẞ')}
                      </strong>
                  ))}
              </span>
          </p>
          {filterGroupBy === 'letterPosition' && (
          <div>
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
                                      {(value / allWordleWords * 100).toFixed(1)}
                                      {'% '}
                                      {t('end.wordsUsed', { count: 100 })}
                                    </span>
                                </strong>
                            ),
                          )}
                      </li>
                  ))}
              </ul>
              <details className="statistics-filters">
                <summary onClick={handleClickSummary}>
                    {/* <h3>{t('statistics.filters')}</h3> */}
                    <h3>Metodologia</h3>
                    <IconAnimatedCaret className="details-icon" />
                </summary>
                <div className="details-content">
                    <div className="about-language-wordle-explanation">
                    <p>
                      Wszystkie litery ze słowa są podzielone na pozycje.
                    </p>
                    <p>
                      Dla każdej pozycji w słowie ustalana jest litera która występuje najczęściej na tej pozycji w słowie.
                    </p>
                    <p>
                      Wynik punktowy dla słowa to suma słów z tą samą pierwszą literą, drugą literą, trzecią literą i tak do końca.
                    </p>
                    <p>
                      Najlepsze słowo w tej metodzie nie musi używać najpopularniejszych liter na danych pozycjach, może być najlepsze, bo oferuje największą skuteczność w zdobywaniu zielonych liter w Wordle.
                    </p>
                  </div>
                </div>
            </details>
          </div>
          )}
          {/* <p>
            {allWordleWords} total
          </p> */}
          {/* <h4>{t('statistics.languageTitleAtTheBeginning')}</h4> */}
          <h4>Inne dobre słowa</h4>
          <div className="about-language-words-list">
            {wordsData.map(({ word, score, result: { total, green, orange, gray } }) => (
                <p key={word}>
                    <span className="about-language-wordle-word">
                      {word.split('').map((letter, index) =>
                        <strong className={clsx('about-language-small-key-cap', { 'about-language-wordle-letter-active': activeLetters[index] === letter })}>
                          {letter.replace('ß', 'ẞ')}
                        </strong>
                      )}
                    </span>

                    {/* {score[filterGroupBy]}
                    pkt */}
                    {' '}
                    <span className={clsx('about-language-word-value', 'about-language-word-value--correct')}>
                      <span>
                        {((green / (total * 5)) * 100).toFixed(2)}%
                      </span>
                    </span>
                    <span className={clsx('about-language-word-value', 'about-language-word-value--position')}>
                      <span>
                        {((orange / (total * 5)) * 100).toFixed(2)}%
                      </span>
                    </span>
                </p>
            ))}
          </div>

          {/* <KeyboardHeatmap groupBy={DictionaryInfoLetters.InWordsWordle} data={data} /> */}
      </section>
  );
};

export default AboutLenguageWordle;
