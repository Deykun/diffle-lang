import { useSelector } from '@store';
import { useQuery } from '@tanstack/react-query';

import { DictionaryInfo} from '@common-types';

import useScrollEffect from '@hooks/useScrollEffect';

import IconGamepad from '@components/Icons/IconGamepad';

import AboutLanguageSpecialCharacters from './AboutLanguageSpecialCharacters';

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
            {data && <AboutLanguageSpecialCharacters data={data} />}
            <h3>TODO:</h3>
            <ul className="to-do">
                <li>About dicitonaries</li>
                <li>Percentage of special characters</li>
                <li>List of special characters</li>
                <li>
                    Most common letter
                    <ul>
                        Keyboard heatmap
                    </ul>
                </li>
                <li>Most common first letter</li>
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
