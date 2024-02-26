import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { DictionaryInfo, DictionaryInfoLetters, ToastType } from '@common-types';

import { capitalize } from '@utils/format';

import KeyboardHeatmap from '@components/Charts/KeyboardHeatmap';

import './AboutLanguageNeighbours.scss';

interface Props {
  data: DictionaryInfo
}

const AboutLenguageWordleStartingWord = ({ data }: Props) => {
  const {
    spellchecker: {
      accepted: {
        all,
      },
      wordle,
    },
  } = data;
  // const {
  //   firstKeys,
  //   middleKeys,
  //   lastKeys,
  // } = useMemo(() => {
  //   return {
  //     firstKeys: {
  //       length2: Object.keys(first[2]),
  //       length3: Object.keys(first[3]),
  //       length4: Object.keys(first[4]),
  //     },
  //     middleKeys: {
  //       length2: Object.keys(middle[2]),
  //       length3: Object.keys(middle[3]),
  //       length4: Object.keys(middle[4]),
  //     },
  //     lastKeys: {
  //       length2: Object.keys(last[2]),
  //       length3: Object.keys(last[3]),
  //       length4: Object.keys(last[4]),
  //     },
  //   };
  // }, [first, last, middle]);

  const { t } = useTranslation();

  if (wordle.length === 0) {
    return null;
  }

  return (
      <section className="about-language-wordle-best-wordls">
          <h2>Najlepsze słowo startowe w Wordle</h2>
          <p>
              Najlepsze słowo startowe to
              {' '}
              <strong>{wordle[0]?.word.toUpperCase()}</strong>
          </p>
          {/* <h4>{t('statistics.languageTitleAtTheBeginning')}</h4> */}
          {wordle.map(({ word, score }) => (
              <p key={word}>
                  {word}
                  :
                  {' '}
                  {score}
                  pkt
              </p>
          ))}

          <KeyboardHeatmap groupBy={DictionaryInfoLetters.InWordsWordle} data={data} />
      </section>
  );
};

export default AboutLenguageWordleStartingWord;
