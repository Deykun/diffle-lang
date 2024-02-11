import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { Pane } from '@common-types';

import { useSelector } from '@store';

import usePanes from '@hooks/usePanes';

import IconBookOpen from '@components/Icons/IconBookOpen';
import IconDictionary from '@components/Icons/IconDictionary';
import IconDictionaryAlt from '@components/Icons/IconDictionaryAlt';

import IconGlobWithFlag from '@components/Icons/IconGlobWithFlag';

import IconGamepad from '@components/Icons/IconGamepad';
import IconGithub from '@components/Icons/IconGithub';
import IconIconmonstr from '@components/Icons/IconIconmonstr';
import IconStart from '@components/Icons/IconStart';

import ReportTranslationBugButton from '@components/Language/ReportTranslationBugButton';

import './Settings.scss'

const SettingsSources = () => {
    const [startCount, setStartCount] = useState<null | number>(null);
    const gameLanguage = useSelector((state) => state.game.language);
    const { t } = useTranslation();

    const { changePane } = usePanes();

    useEffect(() => {
        (async () => {
            if (typeof startCount === 'number') {
                return;
            }

            try {
                const response = await fetch('https://api.github.com/repos/Deykun/diffle-lang');
                const result = await response.json();

                const { stargazers_count } = result;

                if (typeof stargazers_count === 'number') {
                    setStartCount(stargazers_count)
                }
            } catch {
                setStartCount(0);
            }
        })();
    }, [startCount]);

    return (
        <>
            <ReportTranslationBugButton />
            <h2>{t('settings.sourcesTitle')}</h2>
            <p>{t('settings.sourcesDescription')}</p>
            <ul>
                <li>
                    <a className="setting setting-inverse" href="https://github.com/Deykun/diffle-lang" title={t('settings.sourceGithub')} target="_blank">
                        <IconGithub />
                        <span>github.com/<strong>Deykun</strong>/diffle-lang</span>
                        {typeof startCount === 'number' && startCount > 0 && <span className={clsx('setting-label', 'position')}>
                            <span>{startCount}</span> <IconStart />
                        </span>}
                    </a>
                </li>
                <li>
                    <a href="https://hedalu244.github.io/diffle/" target="_blank" rel="noopener noreferrer">
                        <IconGamepad /><span>{t('settings.sourceDiffle')}</span>
                    </a>
                </li>
            </ul>
            <h2>{t('settings.sourcesTitleDictionaries')}: {t('settings.currentLanguage')}</h2>
            <ul className="list-col-3">
                <li>
                    <button className="setting" onClick={() => changePane(Pane.AboutLanguage)}>
                        <IconBookOpen />
                        <span>{t('settings.statisticsTitle')}</span>
                    </button>
                </li>
                {gameLanguage === 'cs' && <>
                    <li>
                        <a href="https://gitlab.com/strepon/czech-cc0-dictionaries/" target="_blank" rel="noopener noreferrer">
                            <IconDictionaryAlt/><span><strong>Czech CC0 dictionaries</strong> {t('settings.sourceDictionarySpellchecker')}</span>
                        </a>
                    </li>
                    <li>
                        <a href="http://home.zcu.cz/~konopik/ppc/" target="_blank" rel="noopener noreferrer">
                            <IconDictionary /><span><strong>slovniky.webz.cz</strong> z <strong>home.zcu.cz</strong> {t('settings.sourceDictionaryWiningWords')}</span>
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
