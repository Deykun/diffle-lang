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

import IconBookOpen from '@components/Icons/IconBookOpen';
import IconPencil from '@components/Icons/IconPencil';
import IconPicture from '@components/Icons/IconPicture';
import IconPictures from '@components/Icons/IconPictures';

import Button from '@components/Button/Button';
import Image from '@components/Image/Image';
import Modal from '@components/Modal/Modal';

import KeyboardHeatmap from '@components/Charts/KeyboardHeatmap';

import { formatLargeNumber } from '@utils/format';

import AboutLanguageChartFooter from './AboutLanguageChartFooter';

import './AboutLanguageLetters.scss'

interface Props {
    groupBy?: DictionaryInfoLetters,
    data: DictionaryInfo
}

const AboutLanguageLetters = ({
    groupBy: groupByInit = DictionaryInfoLetters.Common,
    data,
}: Props) => {
    const {
        spellchecker: {
            accepted: {
                all,
            },
        },
    } = data;
    const dispatch = useDispatch();
    const gameLanguage = useSelector((state) => state.game.language);

    const [shouldShowFilter, setShouldShowFilter] = useState(true);
    const [filterGroupBy, setFilterGroupBy] = useState(groupByInit);
    const [shouldShowLanguageTitle, setShouldShowLanguageTitle] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { t } = useTranslation();

    const handleDownload = async () => {
        const  domElement = document.getElementById('sharable-heatmap');
  
        if (!domElement) {
            return;
        }
    
        try {
            const dataUrl = await htmlToImage.toJpeg(domElement);

            const { stampOnlyTime } = getNow();
            
            download(dataUrl, `diffle-${gameLanguage}-${stampOnlyTime.replaceAll(' ', '')}.jpeg`);
        } catch (error) {
            console.error(error);
  
            dispatch(setToast({ type: ToastType.Incorrect, text: `common.downloadError` }));
        }
    };

    return (
        <section>
            {shouldShowFilter && <nav className="heatmap-keyboard-filters">
                <Button
                    onClick={() => setFilterGroupBy(DictionaryInfoLetters.Common)}
                    isInverted
                    hasBorder={false}
                    isText={filterGroupBy !== DictionaryInfoLetters.Common}
                >
                    popularność
                </Button>
                <Button
                    onClick={() => setFilterGroupBy(DictionaryInfoLetters.InWords)}
                    isInverted
                    hasBorder={false}
                    isText={filterGroupBy !== DictionaryInfoLetters.InWords}
                >
                    liczba słów
                </Button>
                <Button 
                    onClick={() => setFilterGroupBy(DictionaryInfoLetters.First)} 
                    isInverted 
                    hasBorder={false} 
                    isText={filterGroupBy !== DictionaryInfoLetters.First}
                >
                    pierwsza
                </Button>
                <Button 
                    onClick={() => setFilterGroupBy(DictionaryInfoLetters.Last)} 
                    isInverted 
                    hasBorder={false} 
                    isText={filterGroupBy !== DictionaryInfoLetters.Last}
                >
                    ostatnia
                </Button>
            </nav>}
            <div className={clsx('wrapper-padding-escape', 'heatmap-share-content-margins', { 'heatmap-share-content-margins--no-filters': !shouldShowFilter })}>
                <div id="sharable-heatmap" className="heatmap-share-content">
                    {shouldShowLanguageTitle && <div className="about-language-chart-language">
                        <Image
                            className="about-language-chart-language-flag"
                            src={`./flags/${gameLanguage}.svg`}
                            alt=""
                        />
                        <h2 className="about-language-chart-language-title">język polski</h2>
                    </div>}
                    {shouldShowFilter
                        ? <>
                        <KeyboardHeatmap groupBy={filterGroupBy} data={data} />
                    </>
                        : <div className="about-language-keyboards">
                        <KeyboardHeatmap groupBy={DictionaryInfoLetters.Common} data={data} />
                        <KeyboardHeatmap groupBy={DictionaryInfoLetters.InWords} data={data} />
                        <KeyboardHeatmap groupBy={DictionaryInfoLetters.First} data={data} />
                        <KeyboardHeatmap groupBy={DictionaryInfoLetters.Last} data={data} />
                    </div>}
                    <AboutLanguageChartFooter />
                </div>
            </div>
            <div className="keyboard-heatmap-actions">
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
                        <li>
                            <button
                                className={clsx('setting', { 'setting-active': shouldShowFilter })}
                                onClick={() => setShouldShowLanguageTitle((value) => !value)}
                            >
                                <IconPictures />
                                <span>{t('statistics.showOneChartWithFilters')}</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </Modal>
        </section>
    )
};

export default AboutLanguageLetters;
