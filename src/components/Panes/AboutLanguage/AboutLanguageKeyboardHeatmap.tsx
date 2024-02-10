import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DictionaryInfo, Word as WordInterface, AffixStatus } from '@common-types';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import useScrollEffect from '@hooks/useScrollEffect';

import IconFlag from '@components/Icons/IconFlag';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconGamepad from '@components/Icons/IconGamepad';

import Word from '@components/Words/Word';

import { formatLargeNumber } from './helpers';

import AboutLanguageKeyboardHeatmapKeyCap from './AboutLanguageKeyboardHeatmapKeyCap'
import './AboutLanguageKeyboardHeatmap.scss'

interface Props {
    data: DictionaryInfo
}

const AboutLanguageKeyboardHeatmap = ({ data: {
    spellchecker: {
        letters,
    },
} }: Props) => {
    const [groupBy, setGroupBy] = useState<'occurance' | 'first' | 'last'>('occurance');
    const { keyLines, characters } = useSelector(selectGameLanguageKeyboardInfo);

    const lettersData = letters[groupBy];

    console.log('lettersData', lettersData);

    const {
        letterKeysByValue,
        min,
        max,
        middle,
    } = useMemo(() => {
        const letterKeysByValue = Object.keys(lettersData);
        const middleIndex = Math.floor(letterKeysByValue.length / 2);

        console.log(middleIndex)

        return {
            letterKeysByValue,
            min: lettersData[letterKeysByValue.at(-1) || ''] || 0,
            max: lettersData[letterKeysByValue[0] || ''] || 0,
            middle: lettersData[letterKeysByValue[middleIndex]] || 0,
        }
    }, [lettersData]);

    return (
        <section className="about-language-special-characters">
            <h2>Keyboard heatmap</h2>
            <button onClick={() => setGroupBy('occurance')}>occurance</button>
            <button onClick={() => setGroupBy('first')}>first</button>
            <button onClick={() => setGroupBy('last')}>last</button>
            min {min} | max {max} | mid {middle}

            <div>
                {letterKeysByValue.slice(0, 5).map((letter) => (<span key={letter}>{letter.toUpperCase()}: {formatLargeNumber(lettersData[letter])} <br /></span>))}
            </div>

            <br />
            <br />
            <br />

            <div className="heatmap-keyboard">
                {keyLines.map((line) => {
                    return (
                        <div key={line[0]} className="line">
                            {line.map((keyText) => {
                                if  (!characters.includes(keyText)) {
                                    return null;
                                }

                                return (<AboutLanguageKeyboardHeatmapKeyCap
                                    key={keyText}
                                    text={keyText}
                                    min={min}
                                    max={max}
                                    middle={middle}
                                    value={lettersData[keyText]}
                                />);
                            })}
                        </div>
                    );
                })}
            </div> 

            <br />
            <br />
            <br />
        </section>
    )
};

export default AboutLanguageKeyboardHeatmap;
