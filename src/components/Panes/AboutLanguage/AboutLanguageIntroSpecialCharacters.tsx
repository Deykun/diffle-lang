import { useTranslation } from 'react-i18next';

import CircleScale from '@components/CircleScale/CircleScale';

type Props = {
  all: number,
  withSpecialCharacters: number,
}

const AboutLanguageIntroSpecialCharacters = ({ all, withSpecialCharacters }: Props) => {
  const { t } = useTranslation();

  if (withSpecialCharacters === 0) {
    return null;
  }

  const percentage = withSpecialCharacters / all * 100;

  return (
      <p>
          {t('statistics.wordsWithSpecialCharacters')}
          :
          {' '}
          <strong className="about-language-percentage">
              {percentage.toFixed(2)}
              %
              <CircleScale startFrom={5} breakPoints={[15, 30, 45, 60]} value={percentage} shouldShowLabels isGreen isPercentage />
          </strong>
          .
      </p>
  );
};

export default AboutLanguageIntroSpecialCharacters;
