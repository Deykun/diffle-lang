import './Chart.scss'

const Chart = () => {
    return (
        <>
            <ul className="chart">
                <li style={{ width: '80%' }}>
                    <span className="chart-word-count">5</span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <strong className="chart-label">49 liter</strong>
                </li>
                <li style={{ width: '100%' }}>
                    <span className="chart-word-count">5.3</span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"  style={{ width: `26%` }}></span>
                    <strong className="chart-label">52 liter</strong>
                </li>
                <li style={{ width: '100%' }}>
                    <span className="chart-word-count">6.5</span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"></span>
                    <span className="chart-word"  style={{ width: `54%` }}></span>
                    <strong className="chart-label">52 liter</strong>
                </li>
                <li style={{ width: '50%' }}>
                    <span className="chart-word-count">2.7</span>
                    <span className="chart-word"></span>
                    <span className="chart-word"  style={{ width: `74%` }}></span>
                    <strong className="chart-label">24 liter</strong>
                </li>
            </ul>
            <br />
            <h4>Liter</h4>
        </>
    )
};

export default Chart;
