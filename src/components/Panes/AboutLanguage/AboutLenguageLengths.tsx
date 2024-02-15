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

import IconDictionary from '@components/Icons/IconDictionary';
import IconPencil from '@components/Icons/IconPencil';
import IconPicture from '@components/Icons/IconPicture';
import IconTranslation from '@components/Icons/IconTranslation';

import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';

import BarChart from '@components/Charts/BarChart';

import AboutLanguageChartFooter from './AboutLanguageChartFooter';
import AboutLanguageChartLanguageTitle from './AboutLanguageChartLanguageTitle';

import './AboutLanguageLetters.scss'

interface Props {
    groupBy?: DictionaryInfoLetters,
    data: DictionaryInfo
}

const AboutLenguageLengths = ({
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

    const [shouldShowLanguageTitle, setShouldShowLanguageTitle] = useState(false);
    const [shouldForceEnglishChart, setShouldForceEnglishChart] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { t } = useTranslation();

    const handleDownload = async () => {
        const  domElement = document.getElementById('sharable-lengths');
  
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

    const lng = shouldForceEnglishChart ? 'en' : gameLanguage;

    return (
        <section>
            <div className={clsx('wrapper-padding-escape')}>
                <div id="sharable-lengths" className={clsx('statistics-card-wrapper')}>
                    {shouldShowLanguageTitle && <AboutLanguageChartLanguageTitle lng={lng} />}
                    <BarChart lng={lng} entries={length} />
                    <AboutLanguageChartFooter lng={lng} data={data} />
                </div>
            </div>
            <div className="keyboard-heatmap-actions">
                <Button className="keyboard-heatmap-action-edit" onClick={() => setIsOpen(true)} isInverted isText hasBorder={false}>
                    <IconPencil />
                </Button>
                <Button onClick={handleDownload} isInverted hasBorder={false}>
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
                                className={clsx('setting', { 'setting-active': shouldShowLanguageTitle })}
                                onClick={() => setShouldShowLanguageTitle((value) => !value)}
                            >
                                <IconDictionary />
                                <span>{t('statistics.showTitleWithLanguage')}</span>
                            </button>
                        </li>
                        {gameLanguage !== 'en' && <li>
                            <button
                                className={clsx('setting', { 'setting-active': shouldForceEnglishChart })}
                                onClick={() => setShouldForceEnglishChart((value) => !value)}
                            >
                                <IconTranslation />
                                <span><small>Chart labels in English</small></span>
                            </button>
                        </li>}
                    </ul>
                </div>
            </Modal>
        </section>
    )
};

export default AboutLenguageLengths;
