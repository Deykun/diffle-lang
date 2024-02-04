import clsx from 'clsx';
import { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGS } from '@const';

import { useSelector } from '@store';

import useVibrate from '@hooks/useVibrate';

import IconConstruction from '@components/Icons/IconConstruction';
import IconTranslation from '@components/Icons/IconTranslation';
import IconQuestionMarkInBubble from '@components/Icons/IconQuestionMarkInBubble';

import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';

import './LanguagePicker.scss';

interface Props {
  className: string,
}

const LanguagePicker = ({ children, className }: Props) => {
  const isGameUpdating = useSelector((state) => state.game.isProcessing || state.game.isLoadingGame);
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const { vibrate } = useVibrate();

  const handleLanguageChange = (lang: string) => {
    vibrate();

    i18n.changeLanguage(lang);
};
 

  return (
    <>
      <button
        className={className}
        onClick={() => setIsOpen(value => !value)}
      >
          {children ? children : <>
            <IconTranslation />
            <span>{t('settings.currentLanguage')}</span>
          </>}
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="settings">
          <h3>{t('ff.ff')}</h3>
          <ul className="list-col-3">
              {SUPPORTED_LANGS.map((lang) => <li key={lang}>
                <button
                  className={clsx('setting', { 'setting-active': lang === i18n.language })}
                  onClick={() => handleLanguageChange(lang)}
                  disabled={isGameUpdating}
                >
                  <img
                    key={lang}
                    className="language-picker-flag"
                    src={`./flags/${lang}.svg`}
                    alt=""
                  />
                  <span>
                    {t('settings.currentLanguage', { lng: lang })}
                  </span>
                  {lang === 'cs' &&  <span className={clsx('setting-label', 'position', 'construction')}>
                      <span>{t('settings.inBetaNow')}</span>
                      <IconConstruction />
                  </span>}
                </button>
              </li>)}
          </ul>
          <Button isInverted isText hasBorder={false}>
            <IconQuestionMarkInBubble />
            <span>
              Chciałbyś nowy język?
            </span>
          </Button>
        </div>
      </Modal>
    </>
  )
};

export default LanguagePicker;
