import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CookiesName, CookiesSettingsInterfence } from '@common-types';

import { IS_MAIN_INSTANCE, COOKIES_INITIAL_SETTINGS_PRESET } from '@const';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import IconCookie from '@components/Icons/IconCookie';
import IconCheckEnter from '@components/Icons/IconCheckEnter';
import IconBookmark from '@components/Icons/IconBookmark';
import IconDictionary from '@components/Icons/IconDictionary';
import IconDictionaryAlt from '@components/Icons/IconDictionaryAlt';

import Button from '@components/Button/Button';
import ButtonTile from '@components/Button/ButtonTile';
import Modal from '@components/Modal/Modal';

import CookiesSettings from './CookiesSettings';

import './CookiesPopup.scss';

const CookiesPopup = () => {
  const areCookiesAlreadyChecked = useSelector(state => state.app.cookies.DIFFLE_LOCAL);
    // 
  const [settings, setSettings] = useState(COOKIES_INITIAL_SETTINGS_PRESET);

  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const handleChange = useCallback(() => {

  }, [settings]);

  // const onClick = () => setIsOpen((value) => !value);

  // const hasExactMatch = urls.some(({ hasExactMatchAlways }) => hasExactMatchAlways);

  // if (!word) {
  //   return null;
  // }

  if (areCookiesAlreadyChecked) {
    return null;
  }

  return (
      <>
          <div className="cookies-popup-wrapper">
              <div className="cookies-popup">
                  <div className="cookies-popup-icon-wrapper">
                      <IconCookie className="cookies-popup-icon" />
                  </div>
                  <h3>Akceptujesz cookies?</h3>
                  <p>
                      Ta strona korzysta z
                      {' '}
                      <b>pamięci podręcznej</b>
                      {' '}
                      Twojej przeglądarki by poprawnie funkcjonować.
                  </p>
                  <p>
                      Akceptując wszystko zgadzasz się także na opcjonalne badanie swojej aktywności (między innymi przy pomocy
                      {' '}
                      <b>Google Analytics</b>
                      ).
                  </p>
                  <div className="cookies-actions">

                      <Button>
                          <span>Akceptuję wszystko</span>
                      </Button>
                      <Button
                        onClick={() => setIsOpen(value => !value)}
                        isInverted
                        hasBorder={false}
                      >
                          {t('settings.title')}
                      </Button>
                  </div>
              </div>
          </div>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className="settings">
                  <h3>{t('settings.title')}</h3>
                  {/* {!hasExactMatch && <p className="dictionary-not-match">{t('common.dictionaryIsNotExactMatch')}</p>} */}
                  <CookiesSettings settings={settings} onChange={setSettings} />
                  <Button
                    isDisabled={!settings.DIFFLE_LOCAL}
                  >
                      <IconCheckEnter />
                      <span>
                          {t('settings.save')}
                      </span>
                  </Button>
              </div>
          </Modal>
      </>
  );
};

export default CookiesPopup;
