import { useQuery } from '@tanstack/react-query';

import { DictionaryInfo, DictionaryInfoLetters } from '@common-types';

import { useSelector } from '@store';

import useScrollEffect from '@hooks/useScrollEffect';

import IconLoader from '@components/Icons/IconLoader';

import AboutLanguageIntro from './AboutLanguageIntro';
import AboutLanguageLetters from './AboutLanguageLetters';
import AboutLanguageNeighbours from './AboutLanguageNeighbours';
import AboutLanguagePlayDiffle from './AboutLanguagePlayDiffle';
import AboutLenguageLengths from './AboutLenguageLengths';
import AboutLenguageWordle from './AboutLenguageWordle';

import './AboutLanguage.scss';

const getDicitonaryData = async (lang: string | undefined): Promise<DictionaryInfo | undefined> => {
  if (!lang) {
    return undefined;
  }

  const response = await fetch(`./dictionary/${lang}/info.json`);
  const rawData = await response.json();

  return rawData;
};

const AboutLanguage = () => {
  const gameLanguage = useSelector(state => state.game.language);

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
              <AboutLenguageWordle data={data} />
              <AboutLanguagePlayDiffle />
          </>
          )}
      </div>
  );
};

export default AboutLanguage;
