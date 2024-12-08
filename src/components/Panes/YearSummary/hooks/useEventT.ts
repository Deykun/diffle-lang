import { useTranslation } from 'react-i18next';

// This page is intended only to polish speakers really so we don't really need to add those phrases anywhere.
const eventDictionary: {
  [lang: string]: {
    [key: string]: string,
  }
} = {
  en: {
    'main.players': 'players',
    'title.hardestWords': 'The hardest',
    'title.easiestWords': 'The easiest',
    'label.totalPlayed': 'Games',
    'label.bestMedianLetters': 'Median',
    'label.bestDailyResults': "Day's best result",
    'label.bestMedianFrom50HardestWordsResults': 'Median',
    'label.bestMedianFrom50BestResults': 'Median',
    'label.description.bestMedianFrom50HardestWordsResults': '(50 hardest words)',
    'label.description.bestMedianFrom50BestResults': '(50 best results)',
  },
  pl: {
    'main.players': 'graczy',
    'title.hardestWords': 'Najtrudniejsze',
    'title.easiestWords': 'Najprostrze',
    'label.totalPlayed': 'Gry',
    'label.bestMedianLetters': 'Mediana',
    'label.bestDailyResults': 'Wynik dnia',
    'label.bestMedianFrom50HardestWordsResults': 'Mediana',
    'label.bestMedianFrom50BestResults': 'Mediana',
    'label.description.bestMedianFrom50HardestWordsResults': '(50 najtrudniejszych słów)',
    'label.description.bestMedianFrom50BestResults': '(50 najlepszych wyników)',
  },
};

export const useEventT = () => {
  const { i18n } = useTranslation();

  const eventT = (key: string, defaultValue?: string) => {
    return eventDictionary[i18n.language]?.[key]
    || eventDictionary.en[key]
    || (defaultValue ?? key);
  };

  return { eventT };
};

export default useEventT;
