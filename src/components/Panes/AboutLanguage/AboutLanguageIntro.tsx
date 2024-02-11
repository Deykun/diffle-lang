import { DictionaryInfo} from '@common-types';

import { formatLargeNumber } from '@utils/format';

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
} }: Props) => {
    return (
        <section>
            <h2>Słownik języka polskiego w liczbach</h2>
            <p>Wszystkich słów <strong>{formatLargeNumber(all)}</strong></p>
            <AboutLanguageIntroSpecialCharacters all={all} withSpecialCharacters={withSpecialCharacters} />
        </section>
    )
};

export default AboutLanguageIntro;
