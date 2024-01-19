import { useTranslation } from 'react-i18next';

import IconConstructionMan from '@components/Icons/IconConstruction';

import './GameUpdateScreen.scss'

interface Props {
    today: string,
}

const GameUpdateScreen = ({ today }: Props) => {
    const { t } = useTranslation();

    return (
        <div className="game-update">
            <IconConstructionMan className="icon-soon" />
            <p dangerouslySetInnerHTML={{
                __html: t('common.gameWillReturnAfter', { today })
            }} />
            <div className='game-update-unlock-hide'>
                {`sessionStorage.setItem('allowDate', '${today}')`}
            </div>
        </div>
    );
};

export default GameUpdateScreen;
