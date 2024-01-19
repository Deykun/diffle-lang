import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector } from '@store';
import { selectGameLanguageKeyboardInfo } from '@store/selectors';

import IconBook from '@components/Icons/IconBook';
import IconBookmark from '@components/Icons/IconBookmark';
import IconDictionary from '@components/Icons/IconDictionary';
import IconDictionaryAlt from '@components/Icons/IconDictionaryAlt';


import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';

import './GoToDictionaryButton.scss';

interface Props {
  word?: string,
}

const GoToDictionaryButton = ({ word = '' }: Props) => {
  const { urls } = useSelector(selectGameLanguageKeyboardInfo);

  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const onClick = () => setIsOpen(value => !value);

  const hasExactMatchAlways = urls.some(({ hasExactMatchAlways }) => hasExactMatchAlways);

  if (!word) {
    return null;
  }

  const {
    url: mainUrl,
    name: mainName,
  } = urls[0];

  return (
    <>
      <span className="buttons-connected">
        <Button
          tagName="a"
          href={mainUrl.replace('{{word}}', word)}
          target="blank"
          rel="noopener noreferrer"
          isInverted
        >
          {hasExactMatchAlways ? <IconDictionary /> : <IconBook />}
          {hasExactMatchAlways ? <span>{t('common.checkInDictionaryWithName', { word, name: mainName })}</span> : <span>{t('common.checkInDictionary', { word })}</span>}
        </Button>
        {!hasExactMatchAlways && (
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
          {!hasExactMatchAlways && <p className="dictionary-not-match">{t('common.dictionaryIsNotExactMatch')}</p>}
          <ul>
              {urls.map(({ url, name }, index) => (<li key={name}>
                  <a className="setting" href={url.replace('{{word}}', word)} target="blank" rel="noopener noreferrer">
                      {index % 2 === 0 ? <IconDictionary /> : <IconDictionaryAlt />}
                      <span className="setting-title-small">
                        {t('common.checkInDictionaryWithName', { word, name })}
                      </span>
                  </a>
              </li>))}
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default GoToDictionaryButton;
