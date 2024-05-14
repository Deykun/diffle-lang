import { useTranslation } from 'react-i18next';

import { useSelector } from '@store';

import Image from '@components/Image/Image';

import './AboutLanguageChartFooter.scss';

type Props = {
  lng?: string,
}

const AboutLanguageChartFooter = ({
  lng,
}: Props) => {
  const gameLanguage = useSelector(state => state.game.language);

  const { t } = useTranslation();

  return (
      <div className="about-language-chart-language">
          <Image
            className="about-language-chart-language-flag"
            src={`./flags/${gameLanguage}.svg`}
            alt=""
          />
          <h2 className="about-language-chart-language-title">{t(`language.${gameLanguage}`, { lng })}</h2>
      </div>
  );
};

export default AboutLanguageChartFooter;
