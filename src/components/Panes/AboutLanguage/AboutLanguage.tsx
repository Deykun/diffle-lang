import { useQuery } from '@tanstack/react-query';

import { DictionaryInfo, DictionaryInfoLetters } from '@common-types';
import { ROOT_PATH } from '@const';

import { useSelector } from '@store';

import useScrollEffect from '@hooks/useScrollEffect';

import IconLoader from '@components/Icons/IconLoader';

import AboutLanguageIntro from './AboutLanguageIntro';
import AboutLanguageLetters from './AboutLanguageLetters';
import AboutLanguageNeighbours from './AboutLanguageNeighbours';
import AboutLanguagePlayDiffle from './AboutLanguagePlayDiffle';
import AboutLanguageWordle from './AboutLanguageWordle';
import AboutLenguageLengths from './AboutLenguageLengths';

import './AboutLanguage.scss';

const getDicitonaryData = async (lang: string | undefined): Promise<DictionaryInfo | undefined> => {
  if (!lang) {
    return undefined;
  }

  const response = await fetch(`${ROOT_PATH}dictionary/${lang}/info.json`);
  const rawData = await response.json();

  const responseWordleBest = await fetch(`${ROOT_PATH}dictionary/${lang}/info-wordle-best.json`);
  const rawDataWordleBest = await responseWordleBest.json();

  rawData.spellchecker.wordle.bestMax = rawDataWordleBest.best.max;
  rawData.spellchecker.wordle.bestMaxGreen = rawDataWordleBest.best.maxGreen;
  rawData.spellchecker.wordle.bestMaxOrange = rawDataWordleBest.best.maxOrange;
  rawData.spellchecker.wordle.bestMaxGray = rawDataWordleBest.best.maxGray;
  rawData.spellchecker.wordle.bestGreen1_5 = rawDataWordleBest.best.green1_5;
  rawData.spellchecker.wordle.bestGreen2_0 = rawDataWordleBest.best.green2_0;

  return rawData;
};

const AboutLanguage = () => {
  const gameLanguage = useSelector((state) => state.game.language);

  useScrollEffect('top', []);

  const {
    isLoading,
    // error,
    data,
  } = useQuery({
    queryFn: () => getDicitonaryData(gameLanguage),
    queryKey: [`about-${gameLanguage}`, gameLanguage],
  });

  return (
    <div className="about-language">
      {isLoading && <IconLoader className="about-language-content-loader" />}
      {data && (
        <>
          <AboutLanguageIntro data={data} />
          <AboutLanguageLetters data={data} groupBy={DictionaryInfoLetters.InWords} />
          <AboutLanguageNeighbours data={data} />
          <AboutLenguageLengths data={data} />
          <AboutLanguageWordle data={data} />
          <AboutLanguagePlayDiffle />
        </>
      )}
    </div>
  );
};

export default AboutLanguage;
