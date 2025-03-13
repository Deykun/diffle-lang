import {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { useSelector, useDispatch } from '@store';
import { track } from '@store/appSlice';

import useLink from '@features/routes/hooks/useLinks';

import IconBookOpen from '@components/Icons/IconBookOpen';
import IconDictionary from '@components/Icons/IconDictionary';
import IconDictionaryAlt from '@components/Icons/IconDictionaryAlt';

import IconGlobWithFlag from '@components/Icons/IconGlobWithFlag';

import IconGamepad from '@components/Icons/IconGamepad';
import IconGithub from '@components/Icons/IconGithub';
import IconIconmonstr from '@components/Icons/IconIconmonstr';
import IconStart from '@components/Icons/IconStart';

import ButtonTile from '@components/Button/ButtonTile';

import ReportTranslationBugButton from '@components/Language/ReportTranslationBugButton';

import { DICTIONARIES_BY_LANG } from './constants';

import './Settings.scss';

const SettingsSources = () => {
  const { getLinkPath } = useLink();
  const dispatch = useDispatch();
  const [startCount, setStartCount] = useState<null | number>(null);
  const gameLanguage = useSelector(state => state.game.language);
  const { t } = useTranslation();

  const dictionaries = useMemo(() => {
    if (!gameLanguage) {
      return [];
    }

    return DICTIONARIES_BY_LANG[gameLanguage] || [];
  }, [gameLanguage]);

  // TODO: move to useQuery()
  useEffect(() => {
    (async () => {
      if (typeof startCount === 'number') {
        return;
      }

      try {
        const response = await fetch(
          'https://api.github.com/repos/Deykun/diffle-lang',
        );
        const result = await response.json();

        const { stargazers_count: stargazersCount } = result;

        if (typeof stargazersCount === 'number') {
          setStartCount(stargazersCount);
        }
      } catch {
        setStartCount(0);
      }
    })();
  }, [startCount]);

  const handleGithubClick = useCallback(() => {
    dispatch(
      track({ name: 'click_github_link', params: { source: 'settings' } }),
    );
  }, [dispatch]);

  return (
      <>
          <ReportTranslationBugButton />
          <h2>{t('settings.sourcesTitle')}</h2>
          <p>{t('settings.sourcesDescription')}</p>
          <ul>
              <li>
                  <ButtonTile
                    tagName="a"
                    isInverted
                    href="https://github.com/Deykun/diffle-lang"
                    title={t('settings.sourceGithub')}
                    onClick={handleGithubClick}
                    target="_blank"
                    rel="noreferrer"
                  >
                      <IconGithub />
                      <span>
                          github.com/
                          <strong>Deykun</strong>
                          /diffle-lang
                      </span>
                      {typeof startCount === 'number' && startCount > 0 && (
                      <span className={clsx('button-tile-label', 'position')}>
                          <span>{startCount}</span>
                          {' '}
                          <IconStart />
                      </span>
                      )}
                  </ButtonTile>
              </li>
              <li>
                  <ButtonTile
                    tagName="a"
                    href="https://hedalu244.github.io/diffle/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      <IconGamepad />
                      <span>{t('settings.sourceDiffle')}</span>
                  </ButtonTile>
              </li>
          </ul>
          <h2>
              {t('settings.sourcesTitleDictionaries')}
              {': '}
              {t('language.currentLanguage')}
          </h2>
          <ul
            className={clsx({
              'list-col-3': (dictionaries.length + 1) % 3 === 0,
            })}
          >
              <li>
                  <ButtonTile
                    tagName="link"
                    href={getLinkPath({ route: 'aboutLanguage' })}
                  >
                      <IconBookOpen />
                      <span>
                          {t('settings.statisticsTitle')}
                          {': '}
                          <br />
                          <strong>{t('language.currentLanguage')}</strong>
                      </span>
                  </ButtonTile>
              </li>
              {dictionaries.map(
                ({ isSpeelchecker = false, href, labelHTML }, index) => (
                    <li key={href}>
                        <ButtonTile
                          tagName="a"
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                            {index % 2 === 0 && <IconDictionary />}
                            {index % 2 === 1 && <IconDictionaryAlt />}
                            <span>
                                <span
                                  // eslint-disable-next-line react/no-danger
                                  dangerouslySetInnerHTML={{
                                    __html: labelHTML,
                                  }}
                                />
                                {' '}
                                {isSpeelchecker
                                  ? t('settings.sourceDictionarySpellchecker')
                                  : t('settings.sourceDictionaryWiningWords')}
                            </span>
                        </ButtonTile>
                    </li>
                ),
              )}
          </ul>
          <h2>{t('settings.sourcesTitleImages')}</h2>
          <ul>
              <li>
                  <ButtonTile
                    tagName="a"
                    href="https://iconmonstr.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      <IconIconmonstr />
                      <span>
                          <strong>iconmonstr</strong>
                          .com
                      </span>
                  </ButtonTile>
              </li>
              <li>
                  <ButtonTile
                    tagName="a"
                    href="https://github.com/lipis/flag-icons"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      <IconGlobWithFlag />
                      <span>
                          github.com/
                          <strong>lipis</strong>
                          /flag-icons
                      </span>
                  </ButtonTile>
              </li>
          </ul>
      </>
  );
};

export default SettingsSources;
