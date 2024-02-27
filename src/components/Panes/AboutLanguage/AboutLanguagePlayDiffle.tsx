import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Pane } from '@common-types';

import {
  getInitPane,
} from '@api/getInit';

import { copyMessage } from '@utils/copyMessage';

import { useDispatch } from '@store';
import { setToast } from '@store/appSlice';

import usePanes from '@hooks/usePanes';

import IconGamepad from '@components/Icons/IconGamepad';
import IconGithub from '@components/Icons/IconGithub';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';

import './AboutLanguagePlayDiffle.scss';

const AboutLanguagePlayDiffle = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { changePane } = usePanes();

  const handleCopy = useCallback(() => {
    const diffleURL = window.location.href.split('?')[0];
    const textToCopy = `${diffleURL}?p=${Pane.AboutLanguage}`;

    copyMessage(textToCopy);

    dispatch(setToast({ text: 'common.copied' }));
  }, [dispatch]);

  return (
      <section className="about-language-play-diffle">
          <h2>{t('help.whatIsDiffleTitle')}</h2>
          <p>{t('help.whatIsDiffleDescription')}</p>
          <Button onClick={() => changePane(getInitPane({ withUrlParam: false }))} isLarge>
              <IconGamepad />
              <span>{t('common.play')}</span>
          </Button>
          <br />
          <br />
          <br />
          <br />
          <Button
            tagName="a"
            href="https://github.com/Deykun/diffle-lang"
            target="_blank"
            isInverted
            isText
            hasBorder={false}
          >
              <IconGithub />
              <span>{t('settings.sourceGithub')}</span>
          </Button>
          <br />
          <br />
          <br />
          <br />
          <h4>
              {t('settings.statisticsTitle')}
              :
              {' '}
              {t('language.currentLanguage')}
          </h4>
          <div>
              <Button onClick={handleCopy} isInverted>
                  <IconShare />
                  <span>{t('common.copyLink')}</span>
              </Button>
          </div>
      </section>
  );
};

export default AboutLanguagePlayDiffle;
