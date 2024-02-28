import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CookiesName, CookiesSettingsInterfence } from '@common-types';

import { IS_MAIN_INSTANCE, COOKIES_INITIAL_SETTINGS_PRESET } from '@const';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import IconCookie from '@components/Icons/IconCookie';
import IconCookies from '@components/Icons/IconCookies';
import IconBookmark from '@components/Icons/IconBookmark';
import IconDictionary from '@components/Icons/IconDictionary';
import IconDictionaryAlt from '@components/Icons/IconDictionaryAlt';

import Button from '@components/Button/Button';
import ButtonTile from '@components/Button/ButtonTile';
import Modal from '@components/Modal/Modal';

// import './CookiesPopup.scss';

interface Props {
  settings: CookiesSettingsInterfence,
}

const CookiesSettings = ({ settings, onChange }: Props) => {
//   const isOfficialDiffle
  const { urls } = useSelector(selectGameLanguageKeyboardInfo);

  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const toggleSetting = (settingName: CookiesName) => {
    onChange({
      ...settings,
      [settingName]: !settings[settingName],
    });
  };

  return (
      <ul className="list-col-3">
          <li>
              <ButtonTile
                isActive={settings.GOOGLE_ANALYTICS}
                onClick={() => toggleSetting(CookiesName.GOOGLE_ANALYTICS)}
              >
                  <IconCookies />
                  <span className="button-tile-title-small">
                      {/* {t('common.checkInDictionaryWithName', { word, name })} */}
                      <strong>Google Analytics</strong>
                      <br />
                      zewnętrzne i opcjonalne
                  </span>
              </ButtonTile>
          </li>
          {IS_MAIN_INSTANCE && (
          <li>
              <ButtonTile
                isActive={settings.DIFFLE_EXTERNAL}
                onClick={() => toggleSetting(CookiesName.DIFFLE_EXTERNAL)}
              >
                  <IconCookies />
                  <span className="button-tile-title-small">
                      {/* {t('common.checkInDictionaryWithName', { word, name })} */}
                      <strong>Diffle</strong>
                      <br />
                      zewnętrzne i opcjonalne
                  </span>
              </ButtonTile>
          </li>
          )}
          <li>
              <ButtonTile
                isActive={settings.DIFFLE_LOCAL}
                onClick={() => toggleSetting(CookiesName.DIFFLE_LOCAL)}
              >
                  <IconCookie />
                  <span className="button-tile-title-small">
                      {/* {t('common.checkInDictionaryWithName', { word, name })} */}
                      <strong>Diffle</strong>
                      <br />
                      lokalne
                      {' '}
                      <br />
                      i niezbędne
                  </span>
              </ButtonTile>
          </li>
      </ul>
  );
};

export default CookiesSettings;
