import { DictionaryInfo} from '@common-types';

import { formatLargeNumber } from '@utils/format';

import { useTranslation } from 'react-i18next';

import AboutLanguageIntroSpecialCharacters from './AboutLanguageIntroSpecialCharacters';

interface Props {
    data: DictionaryInfo
}

const AboutLanguageIntro = ({ data: {
    spellchecker: {
        accepted: {
            all,
            withSpecialCharacters,
        },
    },
    meta: {
        nativeSpeakersFromWikipedia,
    },
} }: Props) => {

    const { t } = useTranslation();

    return (
        <section>
            <h2>{t('settings.statisticsTitle')}</h2>
            <p>Native speakers <strong>{formatLargeNumber(nativeSpeakersFromWikipedia)}</strong></p>
            <AboutLanguageIntroSpecialCharacters all={all} withSpecialCharacters={withSpecialCharacters} />
        </section>
    )
};

export default AboutLanguageIntro;
