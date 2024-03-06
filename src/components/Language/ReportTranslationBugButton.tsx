import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { IS_MAIN_INSTANCE } from '@const';

import { useDispatch } from '@store';
import { track } from '@store/appSlice';

import IconBug from '@components/Icons/IconBug';

import Button from '@components/Button/Button';

const ReportTranslationBugButton = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleGithubClick = useCallback(() => {
    dispatch(track({ name: 'click_github_link', params: { source: 'settings' } }));
  }, [dispatch]);

  if (!IS_MAIN_INSTANCE) {
    return null;
  }

  return (
      <Button
        tagName="a"
        href="https://crowdin.com/project/diffle-lang"
        target="_blank"
        onClick={handleGithubClick}
        isInverted
        isText
        hasBorder={false}
      >
          <IconBug />
          <span>{t('settings.reportTranslationBug')}</span>
      </Button>
  );
};

export default ReportTranslationBugButton;
