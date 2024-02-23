import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import { ToastType } from '@common-types';

import { useDispatch, useSelector } from '@store';
import { setToast } from '@store/appSlice';

import { getNow } from '@utils/date';

import { ModeFilter, removeStatisticsByGameMode } from '@utils/statistics';

import IconDay from '@components/Icons/IconDay';
import IconEraser from '@components/Icons/IconEraser';
import IconInfinity from '@components/Icons/IconInfinity';
import IconPicture from '@components/Icons/IconPicture';

import Button from '@components/Button/Button';
import ButtonSettingWithConfirm from '@components/Button/ButtonSettingWithConfirm';
import Modal from '@components/Modal/Modal';

import './StatisticsActions.scss';

interface Props {
  refreshStatitics: () => void,
  modeFilter: ModeFilter,
}

const StatisticsActions = ({ refreshStatitics, modeFilter }: Props) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const gameLanguage = useSelector(state => state.game.language);

  const { t } = useTranslation();

  const handleDownload = async () => {
    const domElement = document.getElementById('sharable-card');

    if (!domElement) {
      return;
    }

    try {
      const dataUrl = await htmlToImage.toJpeg(domElement);

      const { stamp, stampOnlyTime } = getNow();
      const fullStamp = `${stamp} ${stampOnlyTime}`;

      download(dataUrl, `diffle-${fullStamp.replaceAll(':', '').replaceAll(' ', '')}.jpeg`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      dispatch(setToast({ type: ToastType.Incorrect, text: 'common.downloadError' }));
    }
  };

  const handleRemoveGameModeStatitics = (gameMode: ModeFilter) => {
    if (!gameLanguage) {
      return;
    }

    removeStatisticsByGameMode({ gameLanguage, gameMode });

    refreshStatitics();

    setIsOpen(false);

    dispatch(setToast({ text: 'statistics.statisticsWasRemoved' }));
  };

  return (
      <>
          <div className="statistics-actions">
              <Button className="statistics-action-edit" onClick={() => setIsOpen(true)} isInverted isText hasBorder={false}>
                  <IconEraser />
              </Button>
              <Button onClick={handleDownload} isInverted>
                  <IconPicture />
                  <span>{t('common.download')}</span>
              </Button>
          </div>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className="settings">
                  <h3>{t('statistics.titleRemoveStatistics')}</h3>
                  <ul>
                      <li>
                          <ButtonSettingWithConfirm
                            onClick={() => handleRemoveGameModeStatitics(ModeFilter.Daily)}
                            isDisabled={modeFilter === ModeFilter.Practice}
                          >
                              <IconDay />
                              <span>{t('game.modeDaily')}</span>
                          </ButtonSettingWithConfirm>
                      </li>
                      <li>
                          <ButtonSettingWithConfirm
                            onClick={() => handleRemoveGameModeStatitics(ModeFilter.Practice)}
                            isDisabled={modeFilter === ModeFilter.Daily}
                          >
                              <IconInfinity />
                              <span>{t('game.modePractice')}</span>
                          </ButtonSettingWithConfirm>
                      </li>
                  </ul>
              </div>
          </Modal>
      </>
  );
};

export default StatisticsActions;
