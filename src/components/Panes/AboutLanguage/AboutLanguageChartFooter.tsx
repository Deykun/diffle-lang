import IconDictionary from '@components/Icons/IconDictionary';

import './AboutLanguageChartFooter.scss'

const AboutLanguageChartFooter = () => {
    // const gameLanguage = useSelector((state) => state.game.language);

    const diffleURL = location.href.replace('http://', '').replace('https://', '').split('?')[0];

    return (
        <div className="chart-footer">
            <IconDictionary /><div><span>{diffleURL}</span> na podstawie słów z <span>SJP.pl</span></div>
        </div>
    )
};

export default AboutLanguageChartFooter;
