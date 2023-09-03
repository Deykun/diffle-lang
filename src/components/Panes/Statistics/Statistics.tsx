import { useTranslation } from 'react-i18next';

import Chart from './Chart';

import IconDiffleChart from '@components/Icons/IconDiffleChart';

import CircleScale from './CircleScale';


import './Statistics.scss'

const Statistics = () => {
    const { t } = useTranslation();

    return (
        <div className="statistics">
            <div>
                <h3>{t('settings.statisticsTitle')}</h3>
                <div className="statistics-summary">
                    <IconDiffleChart className="statistics-summary-icon" />
                    <p className="statistics-letters">
                        <strong>
                            83.9
                            <CircleScale breakPoints={[20, 40, 60, 80, 110]} value={83.9} />
                        </strong>
                        liter
                    </p>
                    <p className="statistics-words">
                        w
                        <strong>
                            8.4
                            <CircleScale breakPoints={[4, 7, 10, 14]} value={8.4} />
                        </strong>
                        słowach    
                    </p>
                    <div className="statistics-other">
                        <p><strong>15</strong> gier</p>
                        <p><strong>14</strong> wygranych</p>
                        <p><strong>4</strong> z rzędu</p>
                        <p><strong>9</strong> najwięcej z rzędu</p>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />

            {/* <CircleScale /> */}
        </div>
    )
};

export default Statistics;
