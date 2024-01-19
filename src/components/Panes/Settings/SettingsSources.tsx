import { useTranslation } from 'react-i18next';

import IconBook from '@components/Icons/IconBook';
import IconDictionary from '@components/Icons/IconDictionary';
import IconDictionaryAlt from '@components/Icons/IconDictionaryAlt';

import IconGlobWithFlag from '@components/Icons/IconGlobWithFlag';

import IconGamepad from '@components/Icons/IconGamepad';
import IconGamepadAlt from '@components/Icons/IconGamepadAlt';
import IconGithub from '@components/Icons/IconGithub';
import IconIconmonstr from '@components/Icons/IconIconmonstr';

import './Settings.scss'

const SettingsSources = () => {

    const { t } = useTranslation();

    return (
        <>
            <h2>{t('settings.sourcesTitle')}</h2>
            <p>{t('settings.sourcesDescription')}</p>
            <ul>
                <li>
                    <a href="https://sjp.pl" target="blank" rel="noopener noreferrer">
                        <IconBook /><span>{t('settings.sourceSJP')}</span>
                    </a>
                </li>
                <li>
                    <a href="https://freedict.org/" target="blank" rel="noopener noreferrer">
                        <IconDictionary /><span>{t('settings.sourceFreeDict')}</span>
                    </a>
                </li>
                <li>
                    <a href="https://github.com/dwyl" target="blank" rel="noopener noreferrer">
                        <IconDictionaryAlt/><span>{t('settings.sourceDwyl')}</span>
                    </a>
                </li>
                <li>
                    <a href="https://iconmonstr.com/" target="blank" rel="noopener noreferrer">
                        <IconIconmonstr /><span>{t('settings.sourceIconmonstr')}</span>
                    </a>
                </li>
                <li>
                    <a href="https://www.nytimes.com/games/wordle/index.html" target="blank" rel="noopener noreferrer">
                        <IconGamepadAlt /><span>{t('settings.sourceWordle')}</span>
                    </a>
                </li>
                <li>
                    <a href="https://github.com/lipis/flag-icons" target="blank" rel="noopener noreferrer">
                        <IconGlobWithFlag /><span>{t('settings.sourceFlagIcons')}</span>
                    </a>
                </li>
                <li>
                    <a href="https://hedalu244.github.io/diffle/" target="blank" rel="noopener noreferrer">
                        <IconGamepad /><span>{t('settings.sourceDiffle')}</span>
                    </a>
                </li>
                <li>
                    <a href="https://github.com/Deykun/diffle-lang" target="blank">
                        <IconGithub /><span>{t('settings.sourceGithub')}</span>
                    </a>
                </li>
            </ul>
        </>
    )
};

export default SettingsSources;
