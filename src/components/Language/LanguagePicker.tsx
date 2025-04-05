import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGS, SUPPORTED_DICTIONARY_BY_LANG, ROOT_PATH } from '@const';

import { useDispatch, useSelector } from '@store';
import { track, setToast } from '@store/appSlice';

import useVibrate from '@hooks/useVibrate';
import useLink from '@features/routes/hooks/useLinks';

import IconBookOpen from '@components/Icons/IconBookOpen';
import IconConstruction from '@components/Icons/IconConstruction';
import IconTranslation from '@components/Icons/IconTranslation';

import Button from '@components/Button/Button';
import ButtonTile from '@components/Button/ButtonTile';
import Image from '@components/Image/Image';
import Modal from '@components/Modal/Modal';

import './LanguagePicker.scss';

type Props = {
  className?: string,
  children?: React.ReactNode,
  place?: string,
};

const LanguagePicker = ({ children, className, place }: Props) => {
  const { activeLink, getLinkPath } = useLink();

  const dispatch = useDispatch();
  const isGameUpdating = useSelector(state => state.game.isProcessing || state.game.isLoadingGame);
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const { vibrate } = useVibrate();

  const onLanguageChanged = (lang: string) => {
    if (lang === i18n.language) {
      return;
    }

    dispatch(setToast({ text: 'settings.languageChanged' }));

    dispatch(track({ name: `click_change_lang_to_${lang}_from_${i18n.language}` }));

    setIsOpen(false);
  };

  const handleTriggerClick = () => {
    vibrate();

    if (place) {
      dispatch(track({ name: `click_languge_picker_opened_from_${place}` }));
    } else {
      dispatch(track({ name: 'click_languge_picker_opened' }));
    }

    setIsOpen(value => !value);
  };

  const onGoToAboutLanguage = () => {
    setIsOpen(value => !value);
  };

  // Change when new language is added if it makes the layout look better
  const shouldShowAboutInLanguages = false;

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
                  <ul className="list-col-4">
                      {shouldShowAboutInLanguages && (
                      <li>
                          <ButtonTile
                            isInverted
                            onClick={onGoToAboutLanguage}
                            tagName="link"
                            href={getLinkPath({ route: 'aboutLanguage' })}
                          >
                              <IconBookOpen />
                              <span>
                                  {t('settings.statisticsTitle')}
                                  :
                                  {' '}
                                  <strong>{t('language.currentLanguage')}</strong>
                              </span>
                          </ButtonTile>
                      </li>
                      )}
                      {SUPPORTED_LANGS.map(lang => (
                          <li key={lang}>
                              <ButtonTile
                                isActive={lang === activeLink.lang}
                                tagName="link"
                                onClick={() => onLanguageChanged(lang)}
                                href={getLinkPath({ lang, route: activeLink.route })}
                                isDisabled={isGameUpdating}
                                variant="small"
                              >
                                  <Image
                                    key={lang}
                                    className="language-picker-flag"
                                    src={`${ROOT_PATH}flags/${lang}.svg`}
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
                  {!shouldShowAboutInLanguages && (
                  <div>
                      <br />
                      <Button
                        onClick={onGoToAboutLanguage}
                        tagName="link"
                        href={getLinkPath({ route: 'aboutLanguage' })}
                        isInverted
                        isText
                      >
                          <IconBookOpen />
                          <span>
                              {t('settings.statisticsTitle')}
                              :
                              {' '}
                              <strong>{t('language.currentLanguage')}</strong>
                          </span>
                      </Button>
                      <br />
                      <br />
                  </div>
                  )}
              </div>
          </Modal>
      </>
  );
};

export default LanguagePicker;
