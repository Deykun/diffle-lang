import Chart from './Chart';

import './Statistics.scss'

const Statistics = () => {
    return (
        <div className="statistics">
            <p>dssds</p>
            <div>
                <span>
                    0 grane
                </span>
                <span>
                    0 wygrane
                </span>
                <span>
                    0 z rzędu
                </span>
                <span>
                    0 najwięcej z rzędu
                </span>
            </div>
            <br />
            <div>
                <h2>Wykres</h2>
                <Chart />
            </div>
        </div>
    )
};

export default Statistics;
