import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DictionaryInfo, DictionaryInfoLetters, Word as WordInterface, AffixStatus } from '@common-types';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import { capitalize } from '@utils/format';

import useScrollEffect from '@hooks/useScrollEffect';

import IconFlag from '@components/Icons/IconFlag';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconGamepad from '@components/Icons/IconGamepad';

import Button from '@components/Button/Button';
import Word from '@components/Words/Word';

import { formatLargeNumber } from './helpers';

import AboutLanguageKeyboardHeatmapKeyCap from './AboutLanguageKeyboardHeatmapKeyCap'
import './AboutLanguageKeyboardHeatmap.scss'

interface Props {
    groupBy?: DictionaryInfoLetters,
    data: DictionaryInfo
}

const AboutLanguageKeyboardHeatmap = ({
    groupBy: groupByInit = DictionaryInfoLetters.Common,
    data: {
        spellchecker: {
            accepted: {
                all,
            },
            letters,
        },
    }
}: Props) => {
    const [groupBy, setGroupBy] = useState(groupByInit);
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
        <section>
            <nav className="heatmap-keyboard-filters">
                <Button onClick={() => setGroupBy(DictionaryInfoLetters.Common)} isInverted hasBorder={false} isText={groupBy !== DictionaryInfoLetters.Common}>
                    popularność
                </Button>
                <Button onClick={() => setGroupBy(DictionaryInfoLetters.InWords)} isInverted hasBorder={false} isText={groupBy !== DictionaryInfoLetters.InWords}>
                    liczba słów
                </Button>
                <Button onClick={() => setGroupBy(DictionaryInfoLetters.First)} isInverted hasBorder={false} isText={groupBy !== DictionaryInfoLetters.First}>
                    pierwsza
                </Button>
                <Button onClick={() => setGroupBy(DictionaryInfoLetters.Last)} isInverted hasBorder={false} isText={groupBy !== DictionaryInfoLetters.Last}>
                    ostatnia
                </Button>
            </nav>
            <div id="sharable-heatmap" className="heatmap-share-content">
                <h2 className="heatmap-keyboard-title">
                    {t(`statistics.languageTitleHighestLetterFor${capitalize(groupBy)}`)}
                </h2>
                <p
                    className="heatmap-keyboard-description"
                    dangerouslySetInnerHTML={{
                        __html: t(`statistics.languageDescriptionHighestLetterFor${capitalize(groupBy)}`, {
                            maxletter: letterKeysByValue[0].toLocaleUpperCase(),
                            maxLetterValue: maxLetterValue.toFixed(isMaxPercentage ? 1 : 2) })
                    }}
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

                                        return (<AboutLanguageKeyboardHeatmapKeyCap
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

                                        return (<AboutLanguageKeyboardHeatmapKeyCap
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
            <div>
                {/* {letterKeysByValue.slice(0, 5).map((letter) => (<span key={letter}>{letter.toUpperCase()}: {formatLargeNumber(lettersData[letter])} <br /></span>))} */}
            </div>
        </section>
    )
};

export default AboutLanguageKeyboardHeatmap;
