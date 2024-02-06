import { useTranslation } from 'react-i18next';

import { useSelector } from '@store';

import IconDictionary from '@components/Icons/IconDictionary';
import IconDictionaryAlt from '@components/Icons/IconDictionaryAlt';

import IconGlobWithFlag from '@components/Icons/IconGlobWithFlag';

import IconGamepad from '@components/Icons/IconGamepad';
import IconGithub from '@components/Icons/IconGithub';
import IconIconmonstr from '@components/Icons/IconIconmonstr';

import './Settings.scss'

const SettingsSources = () => {
    const gameLanguage = useSelector((state) => state.game.language);
    const { t } = useTranslation();

    return (
        <>
            <h2>{t('settings.sourcesTitle')}</h2>
            <p>{t('settings.sourcesDescription')}</p>
            <ul>
                <li>
                    <a href="https://github.com/Deykun/diffle-lang" target="_blank">
                        <IconGithub /><span>{t('settings.sourceGithub')}</span>
                    </a>
                </li>
                <li>
                    <a href="https://hedalu244.github.io/diffle/" target="_blank" rel="noopener noreferrer">
                        <IconGamepad /><span>{t('settings.sourceDiffle')}</span>
                    </a>
                </li>
            </ul>
            <h2>{t('settings.sourcesTitleDictionaries')}: {t('settings.currentLanguage')}</h2>
            <ul>
                {gameLanguage === 'cs' && <>
                    <li>
                        <a href="https://gitlab.com/strepon/czech-cc0-dictionaries/" target="_blank" rel="noopener noreferrer">
                            <IconDictionaryAlt/><span><strong>Czech CC0 dictionaries</strong> {t('settings.sourceDictionarySpellchecker')}</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.dicts.info/uddl.php" target="_blank" rel="noopener noreferrer">
                            <IconDictionary /><span><strong>OmegaWiki</strong> z <strong>Dicts.info</strong> {t('settings.sourceDictionaryWiningWords')}</span>
                        </a>
                    </li>
                </>}
                {gameLanguage === 'en' && <>
                    <li>
                        <a href="https://github.com/dwyl" target="_blank" rel="noopener noreferrer">
                            <IconDictionaryAlt /><span>github.com/<strong>dwyl</strong> {t('settings.sourceDictionarySpellchecker')}</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://freedict.org/" target="_blank" rel="noopener noreferrer">
                            <IconDictionary /><span><strong>freedict.org</strong> {t('settings.sourceDictionaryWiningWords')}</span>
                        </a>
                    </li>
                </>}
                {gameLanguage === 'pl' && <>
                    <li>
                        <a href="https://sjp.pl" target="_blank" rel="noopener noreferrer">
                            <IconDictionaryAlt/><span><strong>sjp.pl</strong> {t('settings.sourceDictionarySpellchecker')}</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://freedict.org/" target="_blank" rel="noopener noreferrer">
                            <IconDictionary /><span><strong>freedict.org</strong> {t('settings.sourceDictionaryWiningWords')}</span>
                        </a>
                    </li>
                </>}
            </ul>
            <h2>{t('settings.sourcesTitleImages')}</h2>
            <ul>
                <li>
                    <a href="https://iconmonstr.com/" target="_blank" rel="noopener noreferrer">
                        <IconIconmonstr /><span><strong>iconmonstr</strong>.com</span>
                    </a>
                </li>
                <li>
                    <a href="https://github.com/lipis/flag-icons" target="_blank" rel="noopener noreferrer">
                        <IconGlobWithFlag /><span>github.com/<strong>lipis</strong>/flag-icons</span>
                    </a>
                </li>
            </ul>
        </>
    )
};

export default SettingsSources;
