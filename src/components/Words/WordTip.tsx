import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useSelector } from '@store';
import {
  selectGameLanguageKeyboardInfo,
  selectHasWordToGuessSpecialCharacters,
} from '@store/selectors';

import './Words.scss';

const WordTip = () => {
  const gameLanguage = useSelector(state => state.game.language);
  const { hasSpecialCharacters: hasLanguageSpecialCharacters } = useSelector(selectGameLanguageKeyboardInfo);
  const hasWordToGuessSpecialCharacters = useSelector(selectHasWordToGuessSpecialCharacters);

  const { t } = useTranslation();

  if (!hasLanguageSpecialCharacters) {
    return null;
  }

  if (hasWordToGuessSpecialCharacters) {
    return (
        <p
          className={clsx('word-tip', 'has-special-character')}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: t('game.withSpecialCharacters', { specialCharacter: t(`game.${gameLanguage}SpecialCharacter`) }),
          }}
        />
    );
  }

  return (
      <p
        className="word-tip"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: t('game.withoutSpecialCharacters', { specialCharacters: t(`game.${gameLanguage}SpecialCharacters`) }),
        }}
      />
  );
};

export default WordTip;
