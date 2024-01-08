import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { GameMode, Pane, PaneChange } from '@common-types';

import { useSelector } from '@store';
import { selectIsGameEnded } from '@store/selectors';

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
    const isGameEnded = useSelector(selectIsGameEnded);
    const gameMode = useSelector(state => state.game.mode);
    const guesses = useSelector((state) => state.game.guesses);

    const { t } = useTranslation();

    const isQuiteBadGameShouldHintHelp = pane === Pane.Game && guesses.length >= 8 && !isGameEnded;

    return (
        <header className="header">
            <div className="header-left">
                <button
                  className={clsx('header-button', 'has-tooltip', 'has-tooltip-from-left', {
                    'button-active': pane === Pane.Help,
                    'has-tooltip-activated': isQuiteBadGameShouldHintHelp,
                  })}
                  onClick={() => changePane(Pane.Help)}
                >
                    {pane === Pane.Help ? <IconClose /> : <IconHelp />}
                    <span className="tooltip">
                      {t(pane === Pane.Help ? 'common.close' : (isQuiteBadGameShouldHintHelp ? 'help.howToPlayTitle' : 'help.title'))}
                    </span>
                </button>
            </div>
            <h1><button onClick={() => changePane(Pane.Game)}>Diffle{gameMode === GameMode.Practice && <IconInfinity />}</button></h1>
            <div className="header-right">
                <button
                  className={clsx('header-button', 'has-tooltip', 'has-tooltip-from-right', {
                    'button-active': pane === Pane.Settings
                  })}
                  onClick={() => changePane(Pane.Settings)}
                >
                    {pane === Pane.Settings ? <IconClose /> : <IconLayers />}
                    <span className="tooltip">{t(pane === Pane.Settings ? 'common.close' : 'settings.title')}</span>
                </button>
            </div>
        </header>
    )
};

export default Header;
