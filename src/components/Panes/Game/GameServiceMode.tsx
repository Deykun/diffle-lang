import { useTranslation } from 'react-i18next';

import IconConstructionMan from '@components/Icons/IconConstruction';
import IconGithub from '@components/Icons/IconGithub';

import Button from '@components/Button/Button';

import './GameServiceMode.scss';

interface Props {
  today: string,
}

const GameServiceMode = ({ today }: Props) => {
  const { t } = useTranslation();

  return (
      <div className="game-update">
          <p
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t('common.serviceMode', { today }),
            }}
          />
          <IconConstructionMan className="icon-soon" />
          <p><strong>{t('common.serviceModeWeReturnSoon')}</strong></p>
          <div className="game-update-actions">
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
          </div>
          <div className="game-update-unlock-hide">
              {`sessionStorage.setItem('allowDate', '${today}')`}
          </div>
      </div>
  );
};

export default GameServiceMode;
