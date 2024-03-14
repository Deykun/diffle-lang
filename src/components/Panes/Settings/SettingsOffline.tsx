import { useTranslation } from 'react-i18next';

import { useSelector } from '@store';

import IconVibrateKeyboard from '@components/Icons/IconVibrateKeyboard';

import ButtonTile from '@components/Button/ButtonTile';

import './Settings.scss';

const SettingsOffline = () => {
  const gameLanguage = useSelector(state => state.game.language);

  const { t } = useTranslation();

  const fetchDictionary = () => {
    if (gameLanguage) {
      fetch(`./dictionary/${gameLanguage}/spelling/chunk-offline.json`);
      fetch(`./dictionary/${gameLanguage}/winning/chunk-offline.json`);
    }
  };
  return (
      <>
          <h3>{t('settings.offlineTitle')}</h3>
          <ul className="list-col-1">
              <li>
                  <ButtonTile
                    onClick={fetchDictionary}
                  >
                      <IconVibrateKeyboard />
                      <span>{t('settings.offlineDownloadLanguage')}</span>
                  </ButtonTile>
              </li>
          </ul>
      </>
  );
};

export default SettingsOffline;
