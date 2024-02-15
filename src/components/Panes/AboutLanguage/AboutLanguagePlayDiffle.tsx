import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Pane } from '@common-types';

import {
    getInitPane,
} from '@api/getInit';

import { copyMessage } from '@utils/copyMessage';

import { useDispatch } from '@store';
import { setToast } from '@store/appSlice';

import usePanes from '@hooks/usePanes';

import IconGamepad from '@components/Icons/IconGamepad';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';

import './AboutLanguagePlayDiffle.scss';

const AboutLanguagePlayDiffle = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { changePane } = usePanes();

    const handleCopy = useCallback(() => {
        const diffleURL = location.href.replace('http://', '').replace('https://', '').split('?')[0];
        const textToCopy = `${diffleURL}?p=${Pane.AboutLanguage}`;
        
        copyMessage(textToCopy);
    
        dispatch(setToast({ text: 'common.copied' }));
    }, [dispatch]);
    
    return (
        <section className="about-language-play-diffle">
            <h4>{t('settings.statisticsTitle')}: {t('language.currentLanguage')}</h4>
            <div>
                <Button onClick={handleCopy} hasBorder={false}>
                    <IconShare />
                    <span>{t('common.copyLink')}</span>
                </Button>
                <br />
                <br />
                <br />
                <br />
            </div>
            <h2>{t('help.whatIsDiffleTitle')}</h2>
            <p>{t('help.whatIsDiffleDescription')}</p>
            <Button onClick={() => changePane(getInitPane({ withUrlParam: false }))} isLarge>
                <IconGamepad />
                <span>{t('common.play')}</span>
            </Button>
        </section>
    )
};

export default AboutLanguagePlayDiffle;
