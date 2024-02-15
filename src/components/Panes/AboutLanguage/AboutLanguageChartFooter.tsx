import { useTranslation } from 'react-i18next';

import { DictionaryInfo } from '@common-types';

import { formatLargeNumber } from '@utils/format';

import IconDictionary from '@components/Icons/IconDictionary';

import './AboutLanguageChartFooter.scss'

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
            }
        },
        meta: {
            spellchecker: {
                fullName,
                url,
            }
        }
}}: Props) => {
    const { t } = useTranslation();

    const diffleURL = location.href.replace('http://', '').replace('https://', '').split('?')[0];

    return (
        <div className="chart-footer">
            <IconDictionary />
            <div dangerouslySetInnerHTML={{
                __html: t('statistics.basedOn', {
                    lng,
                    product: `<span>${diffleURL}</span>`,
                    words: `<span>${formatLargeNumber(all)}</span>`,
                    source: `<a target="_blank" rel="noopener noreferrer" href="${url}">${fullName}</a>`,
                })
            }} />
        </div>
    )
};

export default AboutLanguageChartFooter;
