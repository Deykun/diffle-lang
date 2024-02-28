import { useTranslation } from 'react-i18next';

import { IS_MAIN_INSTANCE } from '@const';

import IconBug from '@components/Icons/IconBug';

import Button from '@components/Button/Button';

const ReportTranslationBugButton = () => {
  const { t } = useTranslation();

  if (!IS_MAIN_INSTANCE) {
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
