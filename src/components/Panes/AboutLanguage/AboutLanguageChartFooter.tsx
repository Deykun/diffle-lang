import { useTranslation } from 'react-i18next';

import { DictionaryInfo } from '@common-types';

import { formatLargeNumber } from '@utils/format';

import IconDictionary from '@components/Icons/IconDictionary';

import './AboutLanguageChartFooter.scss';

interface Props {
  lng?: string,
  data: DictionaryInfo
}

const AboutLanguageChartFooter = ({
  lng,
  data: {
    spellchecker: {
      accepted: {
        all,
      },
    },
    meta: {
      spellchecker,
      spellcheckerAlt,
    },
  },
}: Props) => {
  const { t } = useTranslation();

  let sourceHTML = `<a target="_blank" rel="noopener noreferrer" href="${spellchecker.url}">${spellchecker.fullName}</a>`;

  if (spellcheckerAlt?.url) {
    sourceHTML += ` & <a target="_blank" rel="noopener noreferrer" href="${spellcheckerAlt.url}">${spellcheckerAlt.fullName}</a>`;
  }

  const diffleURL = window.location.href.replace('http://', '').replace('https://', '').split('?')[0];

  return (
      <div className="chart-footer">
          <IconDictionary />
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t('statistics.basedOn', {
                lng,
                product: `<span>${diffleURL}</span>`,
                words: `<span>${formatLargeNumber(all)}</span>`,
                source: sourceHTML,
              }),
            }}
          />
      </div>
  );
};

export default AboutLanguageChartFooter;
