import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DictionaryInfo, DictionaryInfoLetters } from '@common-types';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import { capitalize } from '@utils/format';

import KeyboardHeatmapKeyCap from './KeyboardHeatmapKeyCap';
import './KeyboardHeatmap.scss';

type Props = {
  groupBy: DictionaryInfoLetters,
  lng?: string,
  data: DictionaryInfo
}

function KeyboardHeatmap({
  groupBy,
  lng,
  data: {
    spellchecker: {
      accepted: {
        all,
      },
      letters,
    },
  },
}: Props) {
  const gameLanguage = useSelector(state => state.game.language);
  const keyboardLayoutIndex = useSelector(state => state.app.keyboardLayoutIndex);
  const { keyLinesToUse, characters } = useSelector(selectGameLanguageKeyboardInfo);

  const lettersData = letters[groupBy];

  const { t } = useTranslation();

  const {
    letterKeysByValue,
    max,
  } = useMemo(() => {
    const letterKeysByValueToPass = Object.keys(lettersData);
    const middleIndex = Math.floor(letterKeysByValueToPass.length / 2);

    return {
      letterKeysByValue: letterKeysByValueToPass,
      min: lettersData[letterKeysByValueToPass.at(-1) || ''] || 0,
      max: lettersData[letterKeysByValueToPass[0] || ''] || 0,
      middle: lettersData[letterKeysByValueToPass[middleIndex]] || 0,
    };
  }, [lettersData]);

  const keyLines = useMemo(() => {
    // It has 2 lines with enter and backspace, but it can be one line
    const isBEPO = gameLanguage === 'fr' && keyboardLayoutIndex === 0;
    if (isBEPO) {
      const total = keyLinesToUse.length;

      return keyLinesToUse.reduce((stack: string[][], line, index) => {
        const isLast = total - 1 === index;

        if (isLast) {
          stack[index - 1] = [...stack[index - 1], ...line];
        } else {
          stack.push(line);
        }

        return stack;
      }, []);
    }

    return keyLinesToUse;
  }, [keyLinesToUse, keyboardLayoutIndex, gameLanguage]);

  const isMaxPercentage = groupBy !== 'common';
  const maxLetterValue = (lettersData[letterKeysByValue[0]] / all) * (isMaxPercentage ? 100 : 1);

  return (
      <div>
          <h2 className="heatmap-keyboard-title">
              {t(`statistics.languageTitleHighestLetterFor${capitalize(groupBy)}`, { lng })}
          </h2>
          <p
            className="heatmap-keyboard-description"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t(`statistics.languageDescriptionHighestLetterFor${capitalize(groupBy)}`, {
                lng,
                maxletter: `<strong class="about-language-small-key-cap">${letterKeysByValue[0].toLocaleUpperCase()}</strong>`,
                maxLetterValue: `<strong>${maxLetterValue.toFixed(isMaxPercentage ? 1 : 2)}${isMaxPercentage ? '%' : ''}</strong>`,
              }),
            }}
          />
          <div className="heatmap-keyboard-wrapper">
              <div className="heatmap-keyboard heatmap-keyboard--background">
                  {keyLines.map((line) => {
                    return (
                        <div key={line[0]} className="line">
                            {line.map((keyText) => {
                              if (!characters.includes(keyText)) {
                                return null;
                              }

                              return (
                                  <KeyboardHeatmapKeyCap
                                    key={keyText}
                                    text={keyText}
                                    max={max}
                                    all={all}
                                    value={lettersData[keyText]}
                                    hasCircle
                                  />
                              );
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
                              if (!characters.includes(keyText)) {
                                return null;
                              }

                              return (
                                  <KeyboardHeatmapKeyCap
                                    key={keyText}
                                    text={keyText}
                                    max={max}
                                    all={all}
                                    value={lettersData[keyText]}
                                    hasTooltip
                                  />
                              );
                            })}
                        </div>
                    );
                  })}
              </div>
          </div>
      </div>
  );
}

export default KeyboardHeatmap;
