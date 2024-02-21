import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Pane as PaneInterface } from '@common-types';

import { SUPPORTED_LANGS, SUPPORTED_DICTIONARY_BY_LANG } from '@const';

import { useDispatch, useSelector } from '@store';
import { setToast } from '@store/appSlice';

import useVibrate from '@hooks/useVibrate';
import usePanes from '@hooks/usePanes';

import IconBookOpen from '@components/Icons/IconBookOpen';
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
  const { changePane } = usePanes();

  const handleLanguageChange = (lang: string) => {
    if (lang === i18n.language) {
      return;
    }

    vibrate();

    i18n.changeLanguage(lang);

    setIsOpen(false);
    dispatch(setToast({ text: `settings.languageChanged` }));
  };

  const handleTriggerClick = () => {
    vibrate();

    setIsOpen(value => !value)
  };

  const handleGoToAboutLanguage = () => {
    changePane(PaneInterface.AboutLanguage);
    setIsOpen(value => !value)
  }

  return (
    <>
      <button
        className={className}
        onClick={handleTriggerClick}
      >
          {children ? children : <>
            <IconTranslation />
            <span>{t('language.currentLanguage')}</span>
          </>}
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="settings">
          <h3>{t('settings.language')}</h3>
          <ul>
              <li>
                <button className="setting" onClick={handleGoToAboutLanguage}>
                    <IconBookOpen />
                    <span>{t('settings.statisticsTitle')}: {t('language.currentLanguage')}</span>
                </button>
              </li>
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
                    {t('language.currentLanguage', { lng: lang })}
                  </span>
                  {SUPPORTED_DICTIONARY_BY_LANG[lang].isBeta === true &&  <span className={clsx('setting-label', 'position', 'construction')}>
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
