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

    const [
        wordExampleNotMatch,
        wordExampleOrder,
        wordExampleInRow,
        wordExampleStartAndEnd,
        wordExampleWin,
    ] = helpGuesses;

    return (
        <div className="help">
            <h2 className="title">{t('help.howToPlayTitle')}</h2>
            <p>{t('help.howToPlayText1')}</p>
            <p>{t('help.howToPlayText2')}</p>
            {helpGuesses.length > 0 && <>
            <h2 className="title">{t(`help.exampleTitle${tEnd}`)}</h2>
                <Word guess={wordExampleNotMatch} />
                <p>{t('help.incorrectLettersTip')}</p>
                <Word guess={wordExampleOrder} />
                <p dangerouslySetInnerHTML={{ __html: t(`help.correctLettersTip${tEnd}`) }}></p>
                <Word guess={wordExampleInRow} />
                <p dangerouslySetInnerHTML={{ __html: t(`help.sequenceOfLettersTip${tEnd}`) }}></p>
                <Word guess={wordExampleStartAndEnd} />
                <p dangerouslySetInnerHTML={{ __html: t(`help.firstAndLastLetterTip${tEnd}`) }}></p>
                <Word guess={wordExampleWin} />
                <p>{t('help.winingWordMessage')}</p>
                <p>
                    <Button onClick={() => changePane(Pane.Game)} isLarge>
                        <IconGamepad />
                        <span>{t('common.play')}</span>
                    </Button>
                </p>
                <p>
                    <Button onClick={() => setIsAlt(value => !value)} isInverted isText hasBorder={false}>
                        <span>{t(isAlt ? 'help.previousExample' : 'help.altExample')}</span>
                    </Button>
                </p>            
            </>}
        </div>
    )
};

export default Help;
