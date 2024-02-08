import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGS } from '@const';

import { useDispatch, useSelector } from '@store';
import { setToast } from '@store/appSlice';

import useVibrate from '@hooks/useVibrate';

import IconConstruction from '@components/Icons/IconConstruction';
import IconTranslation from '@components/Icons/IconTranslation';

import Image from '@components/Image/Image';
import Modal from '@components/Modal/Modal';

import ReportTranslationBugButton from './ReportTranslationBugButton';

import './LanguagePicker.scss';

interface Props {
  className?: string,
  children?: React.ReactNode,
}

const LanguagePicker = ({ children, className }: Props) => {
  const dispatch = useDispatch();
  const isGameUpdating = useSelector((state) => state.game.isProcessing || state.game.isLoadingGame);
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const { vibrate } = useVibrate();

  const handleLanguageChange = (lang: string) => {
    if (lang === i18n.language) {
      return;
    }

    vibrate();

    i18n.changeLanguage(lang);

    setIsOpen(false);
    dispatch(setToast({ text: `settings.languageChanged` }));
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
          <h3>{t('settings.language')}</h3>
          <ul className="list-col-3">
              {SUPPORTED_LANGS.map((lang) => <li key={lang}>
                <button
                  className={clsx('setting', { 'setting-active': lang === i18n.language })}
                  onClick={() => handleLanguageChange(lang)}
                  disabled={isGameUpdating}
                >
                  <Image
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
          <ReportTranslationBugButton />
        </div>
      </Modal>
    </>
  )
};

export default LanguagePicker;
