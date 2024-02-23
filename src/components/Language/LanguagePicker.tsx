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

import ButtonTile from '@components/Button/ButtonTile';
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
  const isGameUpdating = useSelector(state => state.game.isProcessing || state.game.isLoadingGame);
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const { vibrate } = useVibrate();
  const { pane, changePane } = usePanes();

  const handleLanguageChange = (lang: string) => {
    if (lang === i18n.language) {
      return;
    }

    vibrate();

    i18n.changeLanguage(lang);

    setIsOpen(false);
    dispatch(setToast({ text: 'settings.languageChanged' }));
  };

  const handleTriggerClick = () => {
    vibrate();

    setIsOpen(value => !value);
  };

  const handleGoToAboutLanguage = () => {
    if (pane !== PaneInterface.AboutLanguage) {
      changePane(PaneInterface.AboutLanguage);
    }

    setIsOpen(value => !value);
  };

  return (
      <>
          <button
            className={className}
            onClick={handleTriggerClick}
            type="button"
            disabled={isGameUpdating}
          >
              {children || (
              <>
                  <IconTranslation />
                  <span>{t('language.currentLanguage')}</span>
              </>
              )}
          </button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className="settings">
                  <h3>{t('settings.language')}</h3>
                  <ul className="list-col-3">
                      <li>
                          <ButtonTile isInverted onClick={handleGoToAboutLanguage}>
                              <IconBookOpen />
                              <span>
                                  {t('settings.statisticsTitle')}
                                  :
                                  {' '}
                                  <strong>{t('language.currentLanguage')}</strong>
                              </span>
                          </ButtonTile>
                      </li>
                      {SUPPORTED_LANGS.map(lang => (
                          <li key={lang}>
                              <ButtonTile
                                isActive={lang === i18n.language}
                                onClick={() => handleLanguageChange(lang)}
                                isDisabled={isGameUpdating}
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
                                  {SUPPORTED_DICTIONARY_BY_LANG[lang].isBeta === true && (
                                  <span className={clsx('button-tile-label', 'position', 'construction')}>
                                      <span>{t('settings.inBetaNow')}</span>
                                      <IconConstruction />
                                  </span>
                                  )}
                              </ButtonTile>
                          </li>
                      ))}
                  </ul>
                  <ReportTranslationBugButton />
              </div>
          </Modal>
      </>
  );
};

export default LanguagePicker;
