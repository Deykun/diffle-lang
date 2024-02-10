import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DictionaryInfo, Word as WordInterface, AffixStatus } from '@common-types';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import useScrollEffect from '@hooks/useScrollEffect';

import IconFlag from '@components/Icons/IconFlag';
import IconFlagAlt from '@components/Icons/IconFlagAlt';
import IconGamepad from '@components/Icons/IconGamepad';

import Word from '@components/Words/Word';

import './AboutLanguageSpecialCharacters.scss'

interface Props {
    data: DictionaryInfo
}

const AboutLanguageSpecialCharacters = ({ data: {
    spellchecker: {
        accepted: {
            all,
            withSpecialCharacters,
            withoutSpecialCharacters,
        },
    },
} }: Props) => {
    const { keyLines, specialCharacters } = useSelector(selectGameLanguageKeyboardInfo);

    const { t } = useTranslation();

    const specialCharactersWord: WordInterface = useMemo(() => {
        const affixes = specialCharacters.map(letter => ({ type: AffixStatus.Unknown, text: letter }));

        return {
            word: specialCharacters.join(''),
            affixes,
        };
    }, [specialCharacters]);

    if (withSpecialCharacters === 0) {
        return null;
    }

    const percentage = `${(withSpecialCharacters / all * 100).toFixed(2)}%`;

    return (
        <section className="about-language-special-characters">
            <h2>Special characters</h2>
            <p>
                <strong>{new Intl.NumberFormat('pl-PL', { maximumSignificantDigits: 5 }).format(all)}</strong> słów w słowniku.
            </p>
            <p>
                Słów ze specjalnymi znakami <strong>{percentage}</strong>.
            </p>
            <p>
                {specialCharacters.length} znaków specjalnych: 
            </p>
            <div className="">
                <Word guess={specialCharactersWord} />
            </div>
            <div className="about-language-progressbar-wrapper">
                <div className="about-language-progressbar-point">
                    <IconFlagAlt />
                    <strong>{new Intl.NumberFormat('pl-PL', { maximumSignificantDigits: 5 }).format(withSpecialCharacters)}</strong>
                    {' '}
                    <span dangerouslySetInnerHTML={{ __html: t('statistics.specialCharactersWith') }} />
                </div>
                <div className="about-language-progressbar">
                    <div className="about-language-progressbar-active" style={{ width: percentage }}>

                    </div>
                </div>
                <div className="about-language-progressbar-point">
                    <IconFlag />
                    <strong>{new Intl.NumberFormat('pl-PL', { maximumSignificantDigits: 5 }).format(withoutSpecialCharacters)}</strong>
                    {' '}
                    <span dangerouslySetInnerHTML={{ __html: t('statistics.specialCharactersWithout') }} />
                </div>
            </div>
        </section>
    )
};

export default AboutLanguageSpecialCharacters;
