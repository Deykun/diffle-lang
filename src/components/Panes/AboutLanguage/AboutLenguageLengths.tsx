import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import { DictionaryInfo, DictionaryInfoLetters } from '@common-types';

import { ToastType } from '@common-types';

import { useDispatch, useSelector } from '@store';
import { setToast } from '@store/appSlice';

import { getNow } from '@utils/date';
import { capitalize } from '@utils/format';

import useScrollEffect from '@hooks/useScrollEffect';

import IconCog from '@components/Icons/IconCog';
import IconCount from '@components/Icons/IconCog';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconGamepad from '@components/Icons/IconGamepad';
import IconLayersAlt from '@components/Icons/IconLayersAlt';
import IconPencil from '@components/Icons/IconPencil';
import IconPicture from '@components/Icons/IconPicture';
import IconPictures from '@components/Icons/IconPictures';

import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';
import Word from '@components/Words/Word';

import BarChart from '@components/Charts/BarChart';

import { formatLargeNumber } from '@utils/format';

// import IconGamepad from '@components/Icons/IconGamepad';
// import KeyboardHeatmapActions from './KeyboardHeatmapActions';
// import KeyboardHeatmapKeyCap from './KeyboardHeatmapKeyCap';

import AboutLanguageChartFooter from './AboutLanguageChartFooter';

import './AboutLanguageLetters.scss'

interface Props {
    groupBy?: DictionaryInfoLetters,
    data: DictionaryInfo
}

const AboutLenguageLengths = ({
    groupBy: groupByInit = DictionaryInfoLetters.Common,
    data,
}: Props) => {
    const {
        spellchecker: {
            accepted: {
                length,
            },
        },
    } = data;
    const dispatch = useDispatch();
    const gameLanguage = useSelector((state) => state.game.language);

    const [shouldShowFilter, setShouldShowFilter] = useState(true);
    const [filterGroupBy, setFilterGroupBy] = useState(groupByInit);
    const [isOpen, setIsOpen] = useState(false);

    // withSpecialCharacters: {},
    // withoutSpecialCharacters: {},

    return (
        <section>
            <div className={clsx('wrapper-padding-escape')}>
                <div id="sharable-length">
                    {/* {Object.entries(length).map(([wordLength, total]) => <p>
                        {wordLength}: {total || ''}
                    </p>)} */}
                    <BarChart entries={length} />
                    <AboutLanguageChartFooter />
                </div>
            </div>
            {/* <div className="keyboard-heatmap-actions">
                <Button className="keyboard-heatmap-action-edit" onClick={() => setIsOpen(true)} isInverted isText hasBorder={false}>
                    <IconPencil />
                </Button>
                <Button onClick={handleDownload} isInverted>
                    <IconPicture />
                    <span>{t('common.download')}</span>
                </Button>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="settings">
                    <h3>{t('settings.title')}</h3>
                    <ul>
                        <li>
                            <button
                                className={clsx('setting', { 'setting-active': shouldShowFilter })}
                                onClick={() => setShouldShowFilter((value) => !value)}
                            >
                                <IconPictures />
                                <span>{t('statistics.showOneChartWithFilters')}</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </Modal> */}
        </section>
    )
};

export default AboutLenguageLengths;
