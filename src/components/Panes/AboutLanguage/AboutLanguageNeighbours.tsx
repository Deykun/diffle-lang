import { DictionaryInfo} from '@common-types';

import { formatLargeNumber } from '@utils/format';

import AboutLanguageIntroSpecialCharacters from './AboutLanguageIntroSpecialCharacters';

interface Props {
    data: DictionaryInfo
}

const AboutLanguageNeighbours = ({ data: {
    spellchecker: {
        substrings: {
            ch2,
            ch3,
            ch4,
        },
    },
} }: Props) => {
    return (
        <section>
            <h2>Części sąsiedzi</h2>
            <p>4 znaki: {Object.keys(ch4).join(', ')}.</p>
            <p>3 znaki: {Object.keys(ch3).join(', ')}.</p>
            <p>2 znaki: {Object.keys(ch2).join(', ')}.</p>
        </section>
    )
};

export default AboutLanguageNeighbours;
