import { DictionaryInfo} from '@common-types';

import './AboutLanguageNeighbours.scss';

interface Props {
    data: DictionaryInfo
}

const AboutLanguageNeighbours = ({ data: {
    spellchecker: {
        substrings: {
            first,
            middle,
            last,
        },
    },
} }: Props) => {
    return (
        <section className="about-language-neighbours">
            <h4>Części sąsiedzi</h4>
            <div className="about-language-neighbours-columns">
                {[2, 3, 4].map((chunkLength) => <div>
                    <strong>{chunkLength} znaki:</strong>
                    <ul className="about-language-neighbours-list--end">
                        {Object.keys(first[chunkLength]).map((part) => <li>{part}</li>)}
                    </ul>
                    <ul className="about-language-neighbours-list--start about-language-neighbours-list--end">
                        {Object.keys(middle[chunkLength]).map((part) => <li>{part}</li>)}
                    </ul>
                    <ul className="about-language-neighbours-list--start">
                        {Object.keys(last[chunkLength]).map((part) => <li>{part}</li>)}
                    </ul>
                </div>)}
            </div>
        </section>
    )
};

export default AboutLanguageNeighbours;
