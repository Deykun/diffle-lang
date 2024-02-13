import { useSelector } from '@store';
import { useQuery } from '@tanstack/react-query';

import { DictionaryInfo, DictionaryInfoLetters } from '@common-types';

import useScrollEffect from '@hooks/useScrollEffect';

import AboutLanguageIntro from './AboutLanguageIntro';
import AboutLanguageLetters from './AboutLanguageLetters';
import AboutLenguageLengths from './AboutLenguageLengths';

import './AboutLanguage.scss'

const getDicitonaryData = async (lang: string | undefined) => {
    if (!lang) {
        return;
    }
    
    const response = await fetch(`./dictionary/${lang}/info.json`);
    const rawData = await response.json();

    console.log(rawData);

    return rawData as DictionaryInfo;
};

const AboutLanguage = () => {
    const gameLanguage = useSelector((state) => state.game.language);

    useScrollEffect('top', [gameLanguage]);

    const {
        isLoading,
        error,
        data,
    } = useQuery({
        queryFn: () => getDicitonaryData(gameLanguage),
        queryKey: [`about-${gameLanguage}`, gameLanguage],
    });

    return (
        <div className="about-language">
            {isLoading && <p>Loading...</p>}
            {data && <>
                <AboutLanguageIntro data={data} />
                <AboutLanguageLetters data={data} groupBy={DictionaryInfoLetters.InWords} />
                <AboutLenguageLengths data={data} />
            </>}
            <h3>TODO:</h3>
            <ul className="to-do">
                <li>About dicitonaries</li>
                <li>Percentage of special characters <strong>x</strong></li>
                <li>List of special characters <strong>x</strong></li>
                <li>
                    Most common letter <strong>x</strong>
                    <ul>
                        Keyboard heatmap <strong>x</strong>
                    </ul>
                </li>
                <li>Most common first letter <strong>x</strong></li>
                <li>
                    Example words using
                    <ul>
                        <li>4 most common with special characters and without</li>
                        <li>5 most common like above</li>
                        <li>6 most common like above?</li>
                    </ul>
                </li>
                <li>Most common 2ch chunk</li>
                <li>Most common 3ch chunk</li>
                <li>Number of spekaers from Wikipedia</li>
            </ul>
        </div>
    )
};

export default AboutLanguage;
