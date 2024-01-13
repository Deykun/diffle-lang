import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import { ToastType, GameMode } from '@common-types';



import { useSelector, useDispatch } from '@store';
import { setToast, toggleShareWords } from '@store/appSlice';
import { selectGuessesStatsForLetters } from '@store/selectors';

import { getWordsIndexesChunks } from '@api/getDoesWordExist';

import { copyMessage } from '@utils/copyMessage';
import { getNow } from '@utils/date';

import { ModeFilter, removeStatisticsByGameMode } from '@utils/statistics';


import { getUrlHashForGameResult, maskValue } from '@utils/urlHash';

import useVibrate from '@hooks/useVibrate';

import IconDay from '@components/Icons/IconDay';
import IconEraser from '@components/Icons/IconEraser';
import IconFingerprint from '@components/Icons/IconFingerprint';
import IconInfinity from '@components/Icons/IconInfinity';
import IconPencil from '@components/Icons/IconPencil';
import IconPicture from '@components/Icons/IconPicture';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';
import ButtonSettingWithConfirm from '@components/Button/ButtonSettingWithConfirm';
import Modal from '@components/Modal/Modal';

import './StatisticsActions.scss';

const StatisticsActions = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const handleDownload = async () => {
      const  domElement = document.getElementById('sharable-card');

      if (!domElement) {
          return;
      }
  
      try {
          const dataUrl = await htmlToImage.toJpeg(domElement);

          const { stamp, stampOnlyTime } = getNow();
          const fullStamp = `${stamp} ${stampOnlyTime}`;
          
          download(dataUrl, `DIFFLE ${fullStamp}.jpeg`);
      } catch (error) {
          console.error(error);

          dispatch(setToast({ type: ToastType.Incorrect, text: `common.downloadError` }));
      }
  };

  const handleRemoveGameModeStatitics = (gameMode: ModeFilter ) => {
    removeStatisticsByGameMode({ gameLanguage: 'pl', gameMode});
  };

  return (
    <>
      <div className="statistics-actions">
          <Button className="statistics-action-edit" onClick={() => setIsOpen(true)} isInverted isText hasBorder={false}>
              <IconPencil />
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
                    >
                        <IconDay />
                        <span>{t('game.modeDaily')}</span>
                    </ButtonSettingWithConfirm>
                </li>
                <li>
                    <ButtonSettingWithConfirm
                        onClick={() => handleRemoveGameModeStatitics(ModeFilter.Practice)}
                    >
                        <IconInfinity />
                        <span>{t('game.modePractice')}</span>
                    </ButtonSettingWithConfirm>
                </li>
            </ul>
          </div>
        </Modal>
      </>
  )
};

export default StatisticsActions;
