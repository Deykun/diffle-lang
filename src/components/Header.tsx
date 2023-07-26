import IconHelp from '@components/Icons/IconHelp';
import IconChart from '@components/Icons/IconChart';

import './Header.scss';

const Header = () => {
  return (
    <header className="header">
        <button className="button-left">
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
