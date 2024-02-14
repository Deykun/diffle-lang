import { useTranslation } from 'react-i18next';

import { Pane } from '@common-types';

import usePanes from '@hooks/usePanes';

import IconGamepad from '@components/Icons/IconGamepad';
import IconHelp from '@components/Icons/IconHelp';

import Button from '@components/Button/Button';

// import AboutLanguageIntroSpecialCharacters from './AboutLanguageIntroSpecialCharacters';

const AboutLanguagePlayDiffle = () => {    
    const { t } = useTranslation();

    const { changePane } = usePanes();

    return (
        <section>
            <h2>Diffle</h2>
            <Button onClick={() => changePane(Pane.Game)} isText isInverted hasBorder={false}>
                
                <IconHelp />
                <span>{t('help.title')}</span>
            </Button>
            {' '}
            <Button onClick={() => changePane(Pane.Game)} isLarge>
                <IconGamepad />
                <span>{t('common.play')}</span>
            </Button>
        </section>
    )
};

export default AboutLanguagePlayDiffle;
