import IconHelp from '@components/Icons/IconHelp';
import IconChart from '@components/Icons/IconChart';

import './Header.scss';

const Header = ({ onPaneChange }) => {
  return (
    <header className="header">
        <button className="button-left" onClick={() => onPaneChange('help')}>
            <IconHelp />
        </button>
        <h1>Diffle</h1>
        <button className="button-right">
            <IconChart />
        </button>
    </header>
  )
};

export default Header;
