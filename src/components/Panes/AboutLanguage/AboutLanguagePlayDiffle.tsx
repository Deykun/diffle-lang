import { useTranslation } from 'react-i18next';

import {
    getInitPane,
} from '@api/getInit';

import usePanes from '@hooks/usePanes';

import IconGamepad from '@components/Icons/IconGamepad';

import Button from '@components/Button/Button';

import './AboutLanguagePlayDiffle.scss';

const AboutLanguagePlayDiffle = () => {    
    const { t } = useTranslation();

    const { changePane } = usePanes();

    return (
        <section className="about-language-play-diffle">
            <h2>{t('help.whatIsDiffleTitle')}</h2>
            <p>{t('help.whatIsDiffleDescription')}</p>
            <Button onClick={() => changePane(getInitPane())} isLarge>
                <IconGamepad />
                <span>{t('common.play')}</span>
            </Button>
        </section>
    )
};

export default AboutLanguagePlayDiffle;
