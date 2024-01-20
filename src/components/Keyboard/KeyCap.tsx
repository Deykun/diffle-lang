import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { AffixStatus} from '@common-types';

import { useSelector } from '@store';
import { selectLetterState, selectWordToSubmit } from '@store/selectors';


import useVibrate from '@hooks/useVibrate';

import IconBackspace from '@components/Icons/IconBackspace';
import IconCheckEnter from '@components/Icons/IconCheckEnter';
import IconClose from '@components/Icons/IconClose';
import IconCircle from '@components/Icons/IconCircle';

import './KeyCap.scss';

interface Props {
    text: string,
    onClick: (type?: AffixStatus | undefined) => void,
}

const KeyCap = ({ text, onClick }: Props) => {
    const type = useSelector(selectLetterState(text));
    const wordToSubmit = useSelector(selectWordToSubmit);

    const isTyped = wordToSubmit.includes(text);

    const { vibrateKeyboardIncorrect } = useVibrate();

    const handleClick = () => {
        onClick(type);

        if (type === AffixStatus.Incorrect) {
            vibrateKeyboardIncorrect();
        }
    }

    const { t } = useTranslation();

    const shouldUseIcon = ['backspace', 'enter', 'spacebar', 'yes', 'no'].includes(text);
    const shouldShowText = !shouldUseIcon || ['yes', 'no'].includes(text);
    const textToShow = ['yes', 'no'].includes(text) ? t(`common.${text}`) : text;

    return (
        <button
            onClick={handleClick}
            className={clsx('key', `key-${text}`, type, { 'typed': isTyped })}>
                {shouldShowText && <span>{textToShow}</span>}
                {shouldUseIcon && <>
                    {text ==='backspace' && <IconBackspace />}
                    {text ==='spacebar' && <IconCircle />}
                    {text ==='enter' && <IconCheckEnter />}
                    {text ==='no' && <IconClose />}
                    {text ==='yes' && <IconCheckEnter />}
                </>}
        </button>
    );
};

export default KeyCap;
