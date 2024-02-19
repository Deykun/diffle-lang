import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DictionaryInfo, DictionaryInfoLetters } from '@common-types';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import { capitalize } from '@utils/format';

import KeyboardHeatmapKeyCap from './KeyboardHeatmapKeyCap'
import './KeyboardHeatmap.scss'

interface Props {
    groupBy: DictionaryInfoLetters,
    lng?: string,
    data: DictionaryInfo
}

const KeyboardHeatmap = ({
    groupBy,
    lng,
    data: {
        spellchecker: {
            accepted: {
                all,
            },
            letters,
        },
    }
}: Props) => {
    const { keyLines, characters } = useSelector(selectGameLanguageKeyboardInfo);

    const lettersData = letters[groupBy];

    const { t } = useTranslation();

    const {
        letterKeysByValue,
        min,
        max,
        middle,
    } = useMemo(() => {
        const letterKeysByValue = Object.keys(lettersData);
        const middleIndex = Math.floor(letterKeysByValue.length / 2);

        return {
            letterKeysByValue,
            min: lettersData[letterKeysByValue.at(-1) || ''] || 0,
            max: lettersData[letterKeysByValue[0] || ''] || 0,
            middle: lettersData[letterKeysByValue[middleIndex]] || 0,
        }
    }, [lettersData]);

    const isMaxPercentage = groupBy !== 'common';
    const maxLetterValue = lettersData[letterKeysByValue[0]] / all * (isMaxPercentage ? 100 : 1);

    return (
        <div> 
            <h2 className="heatmap-keyboard-title">
                {t(`statistics.languageTitleHighestLetterFor${capitalize(groupBy)}`, { lng })}
            </h2>
            <p
                className="heatmap-keyboard-description"
                dangerouslySetInnerHTML={{
                    __html: t(`statistics.languageDescriptionHighestLetterFor${capitalize(groupBy)}`, {
                        lng,
                        maxletter: `<strong class="about-language-small-key-cap">${letterKeysByValue[0].toLocaleUpperCase()}</strong>`,
                        maxLetterValue: `<strong>${maxLetterValue.toFixed(isMaxPercentage ? 1 : 2)}${isMaxPercentage ? '%' : ''}</strong>`,
                })}}
            />
            <div className="heatmap-keyboard-wrapper">
                <div className="heatmap-keyboard heatmap-keyboard--background">
                    {keyLines.map((line) => {
                        return (
                            <div key={line[0]} className="line">
                                {line.map((keyText) => {
                                    if  (!characters.includes(keyText)) {
                                        return null;
                                    }

                                    return (<KeyboardHeatmapKeyCap
                                        key={keyText}
                                        text={keyText}
                                        min={min}
                                        max={max}
                                        middle={middle}
                                        all={all}
                                        value={lettersData[keyText]}
                                        hasCircle
                                    />);
                                })}
                            </div>
                        );
                    })}
                </div>
                <div className="heatmap-keyboard heatmap-keyboard--front">
                    {keyLines.map((line) => {
                        return (
                            <div key={line[0]} className="line">
                                {line.map((keyText) => {
                                    if  (!characters.includes(keyText)) {
                                        return null;
                                    }

                                    return (<KeyboardHeatmapKeyCap
                                        key={keyText}
                                        text={keyText}
                                        min={min}
                                        max={max}
                                        middle={middle}
                                        all={all}
                                        value={lettersData[keyText]}
                                        hasTooltip
                                    />);
                                })}
                            </div>
                        );
                    })}                 
                </div>
            </div>
        </div>
    )
};

export default KeyboardHeatmap;