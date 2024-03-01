import { useTranslation } from 'react-i18next';

import IconBug from '@components/Icons/IconBug';

import Button from '@components/Button/Button';

const ReportTranslationBugButton = () => {
  const { t } = useTranslation();

  /* I don't want to gather reports from possible forks because I cannot update them. ~ deykun */
  const isSiteValid = ['localhost', 'deykun'].some(phrase => window.location.href.includes(phrase));

  if (!isSiteValid) {
    return null;
  }

  return (
      <Button
        tagName="a"
        href="https://crowdin.com/project/diffle-lang"
        target="_blank"
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
