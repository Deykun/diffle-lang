import clsx from 'clsx';

import { GameMode } from '@common-types';

import { useSelector } from '@store';

import IconClose from '@components/Icons/IconClose';
import IconHelp from '@components/Icons/IconHelp';
import IconInfinity from '@components/Icons/IconInfinity';
import IconLayers from '@components/Icons/IconLayers';

import './Header.scss';

interface Props {
    pane?: string,
    changePane: (pane: string) => void;
}

const Header = ({ pane, changePane }: Props) => {
    const gameMode = useSelector(state => state.game.mode);

    return (
        <header className="header">
            <div className="header-left">
                <button
                  className={clsx('header-button', {
                    'button-active': pane ==='help'
                  })}
                  onClick={() => changePane('help')}
                >
                    {pane === 'help' ? <IconClose /> : <IconHelp />}
                </button>
            </div>
            <h1><button onClick={() => changePane('game')}>Diffle{gameMode === GameMode.Practice && <IconInfinity />}</button></h1>
            <div className="header-right">
                <button className={clsx('header-button', { 'button-active': pane ==='settings' })} onClick={() => changePane('settings')}>
                    {pane === 'settings' ? <IconClose /> : <IconLayers />}
                </button>
            </div>
        </header>
    )
};

export default Header;
