import { useTranslation } from 'react-i18next';

import { DictionaryInfo } from '@common-types';

import AboutLanguageIntroSpecialCharacters from './AboutLanguageIntroSpecialCharacters';

interface Props {
  data: DictionaryInfo
}

const AboutLanguageIntro = ({
  data: {
    spellchecker: {
      accepted: {
        all,
        withSpecialCharacters,
      },
    },
  },
}: Props) => {
  const { t } = useTranslation();

  return (
      <section>
          <h2 className="about-language-intro-title">
              {t('settings.statisticsTitle')}
              :
              {' '}
              {t('language.currentLanguage')}
          </h2>
          <AboutLanguageIntroSpecialCharacters all={all} withSpecialCharacters={withSpecialCharacters} />
      </section>
  );
};

export default AboutLanguageIntro;
