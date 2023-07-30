import clsx from 'clsx';

import IconHelp from '@components/Icons/IconHelp';
import IconChart from '@components/Icons/IconChart';

import './Header.scss';

interface Props {
    pane?: string,
    changePane: (pane: string) => void;
}

const Header = ({ pane, changePane }: Props) => {
    return (
        <header className="header">
            <div className="header-left">
                <button className={clsx('header-button', { 'button-active': pane ==='help' })} onClick={() => changePane('help')}>
                    <IconHelp />
                </button>
            </div>
            <h1>Diffle</h1>
            <div className="header-right">
                <button className={clsx('header-button', { 'button-active': pane ==='summary' })} onClick={() => changePane('summary')}>
                    <IconChart />
                </button>
            </div>
        </header>
    )
};

export default Header;
