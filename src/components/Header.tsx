import clsx from 'clsx';

import { GameMode, Pane, PaneChange } from '@common-types';

import { useSelector } from '@store';

import IconClose from '@components/Icons/IconClose';
import IconHelp from '@components/Icons/IconHelp';
import IconInfinity from '@components/Icons/IconInfinity';
import IconLayers from '@components/Icons/IconLayers';

import './Header.scss';

interface Props {
    pane: Pane,
    changePane: PaneChange,
}

const Header = ({ pane, changePane }: Props) => {
    const gameMode = useSelector(state => state.game.mode);

    return (
        <header className="header">
            <div className="header-left">
                <button
                  className={clsx('header-button', {
                    'button-active': pane === Pane.Help
                  })}
                  onClick={() => changePane(Pane.Help)}
                >
                    {pane === Pane.Help ? <IconClose /> : <IconHelp />}
                </button>
            </div>
            <h1><button onClick={() => changePane(Pane.Game)}>Diffle{gameMode === GameMode.Practice && <IconInfinity />}</button></h1>
            <div className="header-right">
                <button
                  className={clsx('header-button', {
                    'button-active': pane === Pane.Settings
                  })} onClick={() => changePane(Pane.Settings)}>
                    {pane === Pane.Settings ? <IconClose /> : <IconLayers />}
                </button>
            </div>
        </header>
    )
};

export default Header;
