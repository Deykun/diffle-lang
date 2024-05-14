import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import { DictionaryInfo, DictionaryInfoLetters, ToastType } from '@common-types';

import { useDispatch, useSelector } from '@store';
import { track, setToast } from '@store/appSlice';

import { getNow } from '@utils/date';
import { capitalize } from '@utils/format';

import IconDictionary from '@components/Icons/IconDictionary';
import IconPencil from '@components/Icons/IconPencil';
import IconPicture from '@components/Icons/IconPicture';
import IconPictures from '@components/Icons/IconPictures';
import IconTranslation from '@components/Icons/IconTranslation';

import Button from '@components/Button/Button';
import ButtonTile from '@components/Button/ButtonTile';
import Modal from '@components/Modal/Modal';

import KeyboardHeatmap from '@components/Charts/KeyboardHeatmap';
import KeyboardLayoutPicker from '@components/Keyboard/KeyboardLayoutPicker';

import AboutLanguageChartFooter from './AboutLanguageChartFooter';
import AboutLanguageChartLanguageTitle from './AboutLanguageChartLanguageTitle';

import './AboutLanguageLetters.scss';

type Props = {
  groupBy?: DictionaryInfoLetters,
  data: DictionaryInfo
};

const AboutLanguageLetters = ({
  groupBy: groupByInit = DictionaryInfoLetters.Common,
  data,
}: Props) => {
  const dispatch = useDispatch();
  const gameLanguage = useSelector(state => state.game.language);

  const [shouldShowFilter, setShouldShowFilter] = useState(true);
  const [filterGroupBy, setFilterGroupBy] = useState(groupByInit);
  const [shouldShowLanguageTitle, setShouldShowLanguageTitle] = useState(false);
  const [shouldForceEnglishChart, setShouldForceEnglishChart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const handleDownload = async () => {
    const domElement = document.getElementById('sharable-heatmap');

    if (!domElement) {
      return;
    }

    try {
      const dataUrl = await htmlToImage.toJpeg(domElement);

      const { stampOnlyTime } = getNow();

      download(dataUrl, `diffle-${gameLanguage}-${stampOnlyTime.replaceAll(':', '').replaceAll(' ', '')}.jpeg`);

      dispatch(track({ name: `click_download_language_heatmap_${gameLanguage}` }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      dispatch(setToast({ type: ToastType.Incorrect, text: 'common.downloadError' }));
    }
  };

  const lng = shouldForceEnglishChart ? 'en' : gameLanguage;

  return (
      <section>
          {shouldShowFilter && (
          <nav className="heatmap-keyboard-filters">
              {Object.values(DictionaryInfoLetters).filter(
                infoLetter => infoLetter !== DictionaryInfoLetters.InWordsWordle,
              ).map(infoLetter => (
                  <Button
                    key={infoLetter}
                    onClick={() => setFilterGroupBy(infoLetter)}
                    isInverted
                    hasBorder={false}
                    isText={filterGroupBy !== infoLetter}
                  >
                      {t(`statistics.filter${capitalize(infoLetter)}`)}
                  </Button>
              ))}
          </nav>
          )}
          <div
            className={clsx('wrapper-padding-escape', 'heatmap-share-content-margins', {
              'heatmap-share-content-margins--no-filters': !shouldShowFilter,
            })}
          >
              <div id="sharable-heatmap" className="heatmap-share-content">
                  {shouldShowLanguageTitle && <AboutLanguageChartLanguageTitle lng={lng} />}
                  {shouldShowFilter
                    ? (
                        <KeyboardHeatmap lng={lng} groupBy={filterGroupBy} data={data} />
                    )
                    : (
                        <div className="about-language-keyboards">
                            <KeyboardHeatmap lng={lng} groupBy={DictionaryInfoLetters.Common} data={data} />
                            <KeyboardHeatmap lng={lng} groupBy={DictionaryInfoLetters.InWords} data={data} />
                            <KeyboardHeatmap lng={lng} groupBy={DictionaryInfoLetters.First} data={data} />
                            <KeyboardHeatmap lng={lng} groupBy={DictionaryInfoLetters.Last} data={data} />
                        </div>
                    )}
                  <AboutLanguageChartFooter lng={lng} data={data} />
              </div>
          </div>
          <div className="keyboard-heatmap-actions">
              <Button onClick={() => setIsOpen(true)} isInverted isText hasBorder={false}>
                  <IconPencil />
              </Button>
              <KeyboardLayoutPicker shouldHideIfDisabled />
              <Button className="about-language-download" onClick={handleDownload} isInverted hasBorder={false}>
                  <IconPicture />
                  <span>{t('common.download')}</span>
              </Button>
          </div>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className="settings">
                  <h3>{t('settings.title')}</h3>
                  <ul className="list-col-3">
                      <li>
                          <ButtonTile
                            isActive={shouldShowFilter}
                            onClick={() => setShouldShowFilter(value => !value)}
                          >
                              <IconPictures />
                              <span>{t('statistics.showOneChartWithFilters')}</span>
                          </ButtonTile>
                      </li>
                      <li>
                          <ButtonTile
                            isActive={shouldShowLanguageTitle}
                            onClick={() => setShouldShowLanguageTitle(value => !value)}
                          >
                              <IconDictionary />
                              <span>{t('statistics.showTitleWithLanguage')}</span>
                          </ButtonTile>
                      </li>
                      <li>
                          <ButtonTile
                            isActive={shouldForceEnglishChart || gameLanguage === 'en'}
                            onClick={() => setShouldForceEnglishChart(value => !value)}
                          >
                              <IconTranslation />
                              <span><small>Chart labels in English</small></span>
                          </ButtonTile>
                      </li>
                  </ul>
              </div>
          </Modal>
      </section>
  );
};

export default AboutLanguageLetters;
