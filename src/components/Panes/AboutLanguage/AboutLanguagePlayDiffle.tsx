import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { copyMessage } from '@utils/copyMessage';

import { useDispatch, useSelector } from '@store';
import { track, setToast } from '@store/appSlice';

import useLinks from '@features/routes/hooks/useLinks';

import IconGamepad from '@components/Icons/IconGamepad';
import IconGithub from '@components/Icons/IconGithub';
import IconShare from '@components/Icons/IconShare';

import Button from '@components/Button/Button';

import './AboutLanguagePlayDiffle.scss';

const AboutLanguagePlayDiffle = () => {
  const dispatch = useDispatch();
  const { getLinkPath } = useLinks();
  const gameLanguage = useSelector((state) => state.game.language);
  const { t } = useTranslation();

  const handleCopy = useCallback(() => {
    const textToCopy = getLinkPath({ route: 'aboutLanguage', shouldHaveDomain: true });

    copyMessage(textToCopy);

    dispatch(setToast({ text: 'common.copied' }));

    dispatch(track({ name: `click_copy_about_language_link_${gameLanguage}` }));
  }, [dispatch, gameLanguage]);

  const handleGithubClick = useCallback(() => {
    dispatch(track({ name: 'click_github_link', params: { source: 'about-language' } }));
  }, [dispatch]);

  return (
    <section className="about-language-play-diffle">
      <h2>{t('help.whatIsDiffleTitle')}</h2>
      <p>{t('help.whatIsDiffleDescription')}</p>
      <Button isLarge tagName="link" href={getLinkPath({ route: 'game' })}>
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
        onClick={handleGithubClick}
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
        {t('settings.statisticsTitle')}:{t('language.currentLanguage')}
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
