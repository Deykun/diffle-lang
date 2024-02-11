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
import IconPencil from '@components/Icons/IconPencil';
import IconPicture from '@components/Icons/IconPicture';

import Button from '@components/Button/Button';
import Word from '@components/Words/Word';

import { formatLargeNumber } from '@utils/format';

import './KeyboardHeatmap.scss'

interface Props {
    groupBy?: DictionaryInfoLetters,
}

const KeyboardHeatmapActions = ({ }: Props) => {
   const { t } = useTranslation();

    return (

    )
};

export default KeyboardHeatmapActions;
