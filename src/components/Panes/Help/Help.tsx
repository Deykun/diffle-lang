import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Pane, Word as WordInterface } from '@common-types';

import { SUPPORTED_LANGS } from '@const';

import { getWordReportForMultipleWords } from '@api/getWordReport';

import usePanes from '@hooks/usePanes';
import useScrollEffect from '@hooks/useScrollEffect';

import Word from '@components/Words/Word'
import Button from '@components/Button/Button';
import IconGamepad from '@components/Icons/IconGamepad';

import { HELP_EXAMPLES_BY_LANG } from './constants';

import HelpWords from './HelpWords';

import './Help.scss'

const Help = () => {
    const [helpGuesses, setHelpGuesses]= useState<WordInterface[]>([]);
    const [isAlt, setIsAlt] = useState(false);

    const { t, i18n } = useTranslation();

    const { changePane } = usePanes();

    const tEnd = isAlt ? `Alt` : '';

    useEffect(() => {
        (async () => {
            const language = i18n.language;
            if (SUPPORTED_LANGS.includes(language)) {
                const keyToUse = isAlt ? 'second' : 'first';
                const {
                    wordToGuess = '',
                    words = [],
                } = HELP_EXAMPLES_BY_LANG[language] ? HELP_EXAMPLES_BY_LANG[language][keyToUse] : {};

                if (words) {
                    const { results } = await getWordReportForMultipleWords(wordToGuess, words, { lang: language, shouldCheckIfExist: false });

                    const guesses = results.map(({ word = '', affixes = [] }) => ({
                        word,
                        affixes,
                    }));
    
                    setHelpGuesses(guesses);

                    return;
                }   
            }
            
            setHelpGuesses([]);
        })();
    }, [isAlt, i18n.language]);

    useScrollEffect('top', [isAlt]);

    return (
        <div className="help">
            <h2 className="title">{t('help.howToPlayTitle')}</h2>
            <p>{t('help.howToPlayText1')}</p>
            <p>{t('help.howToPlayText2')}</p>
            <HelpWords helpGuesses={helpGuesses} tEnd={tEnd} />
            <p>
                <Button onClick={() => changePane(Pane.Game)} isLarge>
                    <IconGamepad />
                    <span>{t('common.play')}</span>
                </Button>
            </p>
            {helpGuesses.length > 0 && <p>
                <Button onClick={() => setIsAlt(value => !value)} isInverted isText hasBorder={false}>
                    <span>{t(isAlt ? 'help.previousExample' : 'help.altExample')}</span>
                </Button>
            </p>}
        </div>
    )
};

export default Help;
