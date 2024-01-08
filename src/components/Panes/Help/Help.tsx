import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Pane, PaneChange } from '@common-types';

import useScrollEffect from '@hooks/useScrollEffect';

import Word from '@components/Words/Word'
import Button from '@components/Button/Button';
import IconGamepad from '@components/Icons/IconGamepad';

import { HELP_WORDS, HELP_WORDS_ALT } from './constants';

import './Help.scss'

interface Props {
    changePane: PaneChange,
}

const Help = ({ changePane }: Props) => {
    const [isAlt, setIsAlt] = useState(false);
    const { t } = useTranslation();

    const words = isAlt ? HELP_WORDS_ALT : HELP_WORDS;
    const tEnd = isAlt ? `Alt` : '';

    useScrollEffect('top', [isAlt]);

    return (
        <div className="help">
            <h2 className="title">{t('help.howToPlayTitle')}</h2>
            <p>{t('help.howToPlayText1')}</p>
            <p>{t('help.howToPlayText2')}</p>
            <h2 className="title">{t(`help.exampleTitle${tEnd}`)}</h2>
            <Word guess={words[0]} />
            <p>{t('help.incorrectLettersTip')}</p>
            <Word guess={words[1]} />
            <p dangerouslySetInnerHTML={{ __html: t(`help.correctLettersTip${tEnd}`) }}></p>
            <Word guess={words[2]} />
            <p dangerouslySetInnerHTML={{ __html: t(`help.sequenceOfLettersTip${tEnd}`) }}></p>
            <Word guess={words[3]} />
            <p dangerouslySetInnerHTML={{ __html: t(`help.firstAndLastLetterTip${tEnd}`) }}></p>
            <Word guess={words[4]} />
            <p>{t('help.winingWordMessage')}</p>
            <p>
                <Button onClick={() => changePane(Pane.Game)} isLarge>
                    <IconGamepad />
                    <span>{t('common.play')}</span>
                </Button>
            </p>
            <p>
                <button onClick={() => setIsAlt(value => !value)} className="help-alt-button">
                    <span>{t(isAlt ? 'help.previousExample' : 'help.altExample')}</span>
                </button>
            </p>
        </div>
    )
};

export default Help;
