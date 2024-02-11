import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DictionaryInfo, Word as WordInterface, AffixStatus } from '@common-types';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import { capitalize } from '@utils/format';

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

const AboutLanguageIntro = ({ data: {
    spellchecker: {
        accepted: {
            all,
        },
        letters,
    },
} }: Props) => {
    return (
        <section>
            <h2>Słownik języka polskiego w liczbach</h2>
            <p>Wszystkich słów <strong>{formatLargeNumber(all)}</strong></p>
        </section>
    )
};

export default AboutLanguageIntro;
