import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { SUPORTED_DICTIONARY_BY_LANG } from '@const';

import { useSelector } from '@store';
import {
    selectGameLanguage,
    selectHasWordToGuessSpecialCharacters,
} from '@store/selectors';

import './Words.scss';

const Words = () => {
    const gameLanguage = useSelector(selectGameLanguage);
    const hasSpecialCharacters = useSelector(selectHasWordToGuessSpecialCharacters);

    const { t } = useTranslation();

    const hasLanguageSpecialCharacters = gameLanguage ? SUPORTED_DICTIONARY_BY_LANG[gameLanguage].hasSpecialCharacters : false ?? false;

    if (!hasLanguageSpecialCharacters) {
        return null;
    }

    if (hasSpecialCharacters) {
        return (<p 
            className={clsx('word-tip', 'has-polish')}
            dangerouslySetInnerHTML={{
                __html: t('game.withSpecialCharacters', { specialCharacter: t(`game.${gameLanguage}SpecialCharacter`) })
            }}
        />);
    }

    return (
        <p 
            className="word-tip"
            dangerouslySetInnerHTML={{
                __html: t('game.withoutSpecialCharacters', { specialCharacters: t(`game.${gameLanguage}SpecialCharacters`) })
            }}
        />
    )
};

export default Words;
