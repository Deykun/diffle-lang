import classNames from 'clsx';

import IconHelp from '@components/Icons/IconHelp';
import IconChart from '@components/Icons/IconChart';

import './Header.scss';

interface Props {
    pane?: string,
}

const Header = ({ pane, onPaneChange }): Props => {
  return (
    <header className="header">
        <button className={classNames('button', 'button-left', { 'button-active': pane ==='help' })} onClick={() => onPaneChange('help')}>
            <IconHelp />
        </button>
        <h1>Diffle</h1>
        <button className={classNames('button', 'button-right', { 'button-active': pane ==='stats' })} onClick={() => onPaneChange('stats')}>
            <IconChart />
        </button>
    </header>
  )
};

export default Header;
