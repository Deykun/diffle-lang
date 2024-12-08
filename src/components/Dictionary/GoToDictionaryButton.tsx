import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { useSelector, useDispatch } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';
import { track } from '@store/appSlice';

import IconBook from '@components/Icons/IconBook';
import IconBookmark from '@components/Icons/IconBookmark';
import IconDictionary from '@components/Icons/IconDictionary';
import IconDictionaryAlt from '@components/Icons/IconDictionaryAlt';

import Button from '@components/Button/Button';
import ButtonTile from '@components/Button/ButtonTile';
import Modal from '@components/Modal/Modal';

import './GoToDictionaryButton.scss';

type Props = {
  word?: string,
  className?: string,
};

const GoToDictionaryButton = ({ word = '', className = '' }: Props) => {
  const dispatch = useDispatch();
  const gameLanguage = useSelector(state => state.game.language);
  const { urls } = useSelector(selectGameLanguageKeyboardInfo);

  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const onClick = () => setIsOpen(value => !value);

  const hasExactMatch = urls.some(({ hasExactMatchAlways }) => hasExactMatchAlways);

  const handleDictionaryClick = useCallback(() => {
    dispatch(track({ name: `click_${gameLanguage}_dictionary_link`, params: { word } }));
  }, [dispatch, gameLanguage, word]);

  if (!word) {
    return null;
  }

  const {
    url: mainUrl,
    name: mainName,
  } = urls[0];

  return (
      <>
          <span
            className={clsx('buttons-connected', {
              [className]: className,
            })}
          >
              <Button
                tagName="a"
                href={mainUrl.replace('{{word}}', word)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDictionaryClick}
                isInverted
              >
                  {hasExactMatch ? <IconDictionary className="go-to-dictionary-icon" /> : <IconBook className="go-to-dictionary-icon" />}
                  {hasExactMatch
                    ? <span>{t('common.checkInDictionaryWithName', { word, name: mainName })}</span>
                    : <span>{t('common.checkInDictionary', { word })}</span>}
              </Button>
              {!hasExactMatch && (
              <Button
                onClick={onClick}
                isInverted
              >
                  <IconBookmark />
              </Button>
              )}
          </span>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className="settings">
                  <h3>{t('common.checkInDictionary', { word })}</h3>
                  {!hasExactMatch && <p className="dictionary-not-match">{t('common.dictionaryIsNotExactMatch')}</p>}
                  <ul>
                      {urls.map(({ url, name }, index) => (
                          <li key={name}>
                              <ButtonTile
                                tagName="a"
                                href={url.replace('{{word}}', word)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleDictionaryClick}
                              >
                                  {index % 2 === 0 ? <IconDictionary /> : <IconDictionaryAlt />}
                                  <span className="button-tile-title-small">
                                      {t('common.checkInDictionaryWithName', { word, name })}
                                  </span>
                              </ButtonTile>
                          </li>
                      ))}
                  </ul>
              </div>
          </Modal>
      </>
  );
};

export default GoToDictionaryButton;
