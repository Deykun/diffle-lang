import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch } from '@store';
import { track } from '@store/appSlice';

import IconConstructionMan from '@components/Icons/IconConstruction';
import IconGithub from '@components/Icons/IconGithub';

import Button from '@components/Button/Button';

import NextDailyTip from '@features/timeToNextDay/components/NextDailyTip';

import './GameServiceMode.scss';

type Props = {
  today: string,
};

const GameServiceMode = ({ today }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleGithubClick = useCallback(() => {
    dispatch(track({ name: 'click_github_link', params: { source: 'service_mode' } }));
  }, [dispatch]);

  return (
      <div className="game-update">
          <p
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t('common.serviceMode', { today }),
            }}
          />
          <IconConstructionMan className="icon-soon" />
          <NextDailyTip shouldWarnIfNearEnd={false} />
          <p><strong>{t('common.serviceModeWeReturnSoon')}</strong></p>
          <div className="game-update-actions">
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
          </div>
          <div className="game-update-unlock-hide">
              {`sessionStorage.setItem('allowDate', '${today}')`}
          </div>
      </div>
  );
};

export default GameServiceMode;
