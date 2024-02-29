import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CookiesName, CookiesSettingsInterfence } from '@common-types';

import { LOCAL_STORAGE, COOKIES_INITIAL_SETTINGS_PRESET } from '@const';

import { useDispatch, useSelector } from '@store';
import { setCookies, setToast } from '@store/appSlice';

import useEffectChange from '@hooks/useEffectChange';

import IconCookie from '@components/Icons/IconCookie';
import IconCheckEnter from '@components/Icons/IconCheckEnter';

import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';

import CookiesSettings from './CookiesSettings';

import './CookiesPopup.scss';

interface Props {
  className?: string,
  children?: React.ReactNode,
  isEditMode?: boolean,
}

const CookiesPopup = ({ className, children, isEditMode = false }: Props) => {
  const dispatch = useDispatch();
  const storeCookies = useSelector(state => state.app.cookies);
  const shouldReloadWhenUnchecked = useSelector(state => state.app.cookies[CookiesName.GOOGLE_ANALYTICS]);
  const areCookiesAlreadyChecked = useSelector(state => state.app.cookies[CookiesName.DIFFLE_LOCAL]);

  const [settings, setSettings] = useState<CookiesSettingsInterfence>(
    areCookiesAlreadyChecked ? storeCookies : { ...COOKIES_INITIAL_SETTINGS_PRESET },
  );
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  useEffectChange(() => {
    if (isEditMode) {
      setSettings(storeCookies);
    }
  }, [isEditMode, storeCookies]);

  const saveCookies = useCallback((cookiesToSave: CookiesSettingsInterfence) => {
    localStorage.setItem(LOCAL_STORAGE.COOKIES, JSON.stringify(cookiesToSave));

    dispatch(setCookies(cookiesToSave));

    setIsOpen(false);

    // Google Analytics (GA) was already added to the site; refreshing guarantees that it was removed
    const shouldReload = shouldReloadWhenUnchecked && !cookiesToSave[CookiesName.GOOGLE_ANALYTICS];
    if (shouldReload) {
      dispatch(setToast({ text: 'settings.cookiesSavedAndRefresh', timeoutSeconds: 5 }));

      setTimeout(() => {
        window.location.reload();
      }, 2 * 1000);
    }
  }, [dispatch, shouldReloadWhenUnchecked]);

  const handleSave = useCallback(() => {
    saveCookies(settings);
  }, [saveCookies, settings]);

  const acceptAll = useCallback(() => {
    saveCookies({ ...COOKIES_INITIAL_SETTINGS_PRESET });
  }, [saveCookies]);

  if (areCookiesAlreadyChecked && !isEditMode) {
    return null;
  }

  return (
      <>
          {children ? (
              <button
                className={className}
                onClick={() => setIsOpen(value => !value)}
                type="button"
              >
                  {children}
              </button>
          ) : (
              <div className="cookies-popup-wrapper">
                  <div className="cookies-popup">
                      <div className="cookies-popup-icon-wrapper">
                          <IconCookie className="cookies-popup-icon" />
                      </div>
                      <div className="cookies-text">
                          <h3>{t('settings.cookiesTitle')}</h3>
                          <p
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: t('settings.cookiesText1') }}
                          />
                          <p
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: t('settings.cookiesText2') }}
                          />
                      </div>
                      <div className="cookies-actions">
                          <Button
                            onClick={acceptAll}
                            dataTestId="accept-all-cookies"
                          >
                              <span>{t('settings.acceptAll')}</span>
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
          )}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className={clsx('settings', 'cookies-settings')}>
                  <h3>{t('settings.privacyTitle')}</h3>
                  <CookiesSettings settings={settings} onChange={setSettings} />
                  {isEditMode ? (
                      <div>
                          <div className="cookies-text">
                              <h3>{t('settings.cookiesTitle')}</h3>
                              <p
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{ __html: t('settings.cookiesText1') }}
                              />
                              <p
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{ __html: t('settings.cookiesText2') }}
                              />
                          </div>
                          <div className="cookies-actions">
                              <Button
                                onClick={acceptAll}
                              >
                                  <span>{t('settings.acceptAll')}</span>
                              </Button>
                              <Button
                                isDisabled={!settings[CookiesName.DIFFLE_LOCAL]}
                                isInverted
                                onClick={handleSave}
                              >
                                  <span>
                                      {t('settings.saveSelected')}
                                  </span>
                              </Button>
                          </div>
                      </div>
                  ) : (
                      <div className="cookies-actions">
                          <Button
                            isDisabled={!settings[CookiesName.DIFFLE_LOCAL]}
                            onClick={handleSave}
                          >
                              <IconCheckEnter />
                              <span>
                                  {t('settings.saveSelected')}
                              </span>
                          </Button>
                      </div>
                  )}

              </div>
          </Modal>
      </>
  );
};

export default CookiesPopup;
