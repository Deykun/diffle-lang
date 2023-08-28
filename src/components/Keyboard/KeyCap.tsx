import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useSelector } from '@store';
import { selectLetterState, selectWordToSubmit } from '@store/selectors';

import IconBackspace from '@components/Icons/IconBackspace';
import IconClose from '@components/Icons/IconClose';
import IconCheckEnter from '@components/Icons/IconCheckEnter';

import './KeyCap.scss';

interface Props {
    text: string,
    onClick: (event: React.MouseEvent<HTMLElement>) => void,
}

const KeyCap = ({ text, onClick }: Props) => {
    const type = useSelector(selectLetterState(text));
    const wordToSubmit = useSelector(selectWordToSubmit);

    const isTyped = wordToSubmit.includes(text);

    const { t } = useTranslation();

    const shouldUseIcon = ['backspace', 'enter', 'yes', 'no'].includes(text);
    const shouldShowText = !shouldUseIcon || ['yes', 'no'].includes(text);
    const textToShow = ['yes', 'no'].includes(text) ? t(`common.${text}`) : text;

    return (
        <button
            onClick={onClick}
            className={clsx('key', `key-${text}`, type, { 'typed': isTyped })}>
                {shouldShowText && <span>{textToShow}</span>}
                {shouldUseIcon && text ==='backspace' && <IconBackspace />}
                {shouldUseIcon && text ==='enter' && <IconCheckEnter />}
                {shouldUseIcon && text ==='no' && <IconClose />}
                {shouldUseIcon && text ==='yes' && <IconCheckEnter />}
        </button>
    );
};

export default KeyCap;
