import classNames from 'clsx';

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
            <button className={classNames('button', 'button-left', { 'button-active': pane ==='help' })} onClick={() => changePane('help')}>
                <IconHelp />
            </button>
            <h1>Diffle</h1>
            <button className={classNames('button', 'button-right', { 'button-active': pane ==='stats' })} onClick={() => changePane('stats')}>
                <IconChart />
            </button>
        </header>
    )
};

export default Header;
