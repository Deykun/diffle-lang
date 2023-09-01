import { useTranslation } from 'react-i18next';

import { Pane, PaneChange } from '@common-types';

import useScrollEffect from '@hooks/useScrollEffect';

import Word from '@components/Words/Word'
import Button from '@components/Button/Button';
import IconGamepad from '@components/Icons/IconGamepad';

import { HELP_WORDS } from './constants';

import './Help.scss'

interface Props {
    changePane: PaneChange,
}

const Help = ({ changePane }: Props) => {
    const { t } = useTranslation();

    useScrollEffect('top', []);

    return (
        <div className="help">
            <h2 className="title">{t('help.howToPlayTitle')}</h2>
            <p>{t('help.howToPlayText1')}</p>
            <p>{t('help.howToPlayText2')}</p>
            <h2 className="title">{t('help.exampleTitle')}</h2>
            <Word guess={HELP_WORDS[0]} />
            <p>{t('help.incorrectLettersTip')}</p>
            <Word guess={HELP_WORDS[1]} />
            <p dangerouslySetInnerHTML={{ __html: t('help.correctLettersTip') }}></p>
            <Word guess={HELP_WORDS[2]} />
            <p dangerouslySetInnerHTML={{ __html: t('help.sequenceOfLettersTip') }}></p>
            <Word guess={HELP_WORDS[3]} />
            <p dangerouslySetInnerHTML={{ __html: t('help.firstAndLastLetterTip') }}></p>
            <Word guess={HELP_WORDS[4]} />
            <p>{t('help.winingWordMessage')}</p>
            <p>
                <Button onClick={() => changePane(Pane.Game)} isLarge>
                    <IconGamepad />
                    <span>{t('common.play')}</span>
                </Button>
            </p>
        </div>
    )
};

export default Help;
