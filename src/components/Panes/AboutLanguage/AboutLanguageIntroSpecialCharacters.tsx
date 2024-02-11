import { useTranslation } from 'react-i18next';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

interface Props {
    all: number,
    withSpecialCharacters: number,
}

const AboutLanguageIntroSpecialCharacters = ({ all, withSpecialCharacters }: Props) => {
    const { specialCharacters } = useSelector(selectGameLanguageKeyboardInfo);

    const { t } = useTranslation();

    if (withSpecialCharacters === 0) {
        return null;
    }

    const percentage = `${(withSpecialCharacters / all * 100).toFixed(2)}%`;

    return (
        <p>
            <strong>{specialCharacters.length}</strong> znaków specjalnych i słów z nimi <strong>{percentage}</strong>.
        </p>
    )
};

export default AboutLanguageIntroSpecialCharacters;
