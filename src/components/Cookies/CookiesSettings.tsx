import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { CookiesName, CookiesSettingsInterfence } from '@common-types';

import IconCookie from '@components/Icons/IconCookie';
import IconCookies from '@components/Icons/IconCookies';

import ButtonTile from '@components/Button/ButtonTile';

import './CookiesPopup.scss';

interface Props {
  settings: CookiesSettingsInterfence,
  onChange: Dispatch<SetStateAction<CookiesSettingsInterfence>>,
}

const CookiesSettings = ({ settings, onChange }: Props) => {
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
                isActive={settings[CookiesName.GOOGLE_ANALYTICS]}
                onClick={() => toggleSetting(CookiesName.GOOGLE_ANALYTICS)}
                dataTestId="cookie-setting-ga"
              >
                  <IconCookies />
                  <span className="button-tile-title-small">
                      <strong>Google Analytics</strong>
                      <br />
                      <span className="cookies-setting-small-label">{t('settings.cookiesExternalOptional')}</span>
                  </span>
              </ButtonTile>
          </li>
          <li>
              <ButtonTile
                isActive={settings[CookiesName.DIFFLE_EXTERNAL]}
                onClick={() => toggleSetting(CookiesName.DIFFLE_EXTERNAL)}
                dataTestId="cookie-setting-diffle-external"
              >
                  <IconCookies />
                  <span className="button-tile-title-small">
                      <strong>DIFFLE</strong>
                      <br />
                      <span className="cookies-setting-small-label">{t('settings.cookiesExternalOptional')}</span>
                  </span>
              </ButtonTile>
          </li>
          <li>
              <ButtonTile
                isActive={settings[CookiesName.DIFFLE_LOCAL]}
                onClick={() => toggleSetting(CookiesName.DIFFLE_LOCAL)}
                dataTestId="cookie-setting-diffle-local"
              >
                  <IconCookie />
                  <span className="button-tile-title-small">
                      <strong>DIFFLE</strong>
                      <br />
                      <span className="cookies-setting-small-label">{t('settings.cookiesLocalRequierd')}</span>
                  </span>
              </ButtonTile>
          </li>
      </ul>
  );
};

export default CookiesSettings;
