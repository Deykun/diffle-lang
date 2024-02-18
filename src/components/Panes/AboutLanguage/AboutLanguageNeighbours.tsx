import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { DictionaryInfo} from '@common-types';

import { capitalize } from '@utils/format';

import './AboutLanguageNeighbours.scss';

interface Props {
    data: DictionaryInfo
}

const AboutLanguageNeighbours = ({ data: {
    spellchecker: {
        accepted: {
            all,
        },
        substrings: {
            first,
            middle,
            last,
        },
    },
} }: Props) => {

    const {
        firstKeys,
        middleKeys,
        lastKeys,
    } = useMemo(() => {
        return {
            firstKeys: {
                'length2': Object.keys(first[2]),
                'length3': Object.keys(first[3]),
                'length4': Object.keys(first[4]),
            },
            middleKeys: {
                'length2': Object.keys(middle[2]),
                'length3': Object.keys(middle[3]),
                'length4': Object.keys(middle[4]),
            },
            lastKeys: {
                'length2': Object.keys(last[2]),
                'length3': Object.keys(last[3]),
                'length4': Object.keys(last[4]),
            },
        };
    }, [first, last, middle]);

    const { t } = useTranslation();

    return (
        <section className="about-language-neighbours">
            <h4>{t('statistics.languageTitleAtTheBeginning')}</h4>
            <div className="about-language-neighbours-columns">
                {[2, 3, 4].map((chunkLength) => {
                    const key  = `length${chunkLength}` as 'length2' | 'length3' | 'length4';

                    return (<div key={key}>
                        <ul className="about-language-neighbours-list--end">
                            {firstKeys[key].map((part) => <li key={part} className="has-tooltip">
                                {capitalize(part)}
                                <span className="tooltip">
                                    {' "'}
                                    {part}
                                    {'" '}
                                    {t('end.in', { postProcess: 'interval', count: 100 })}
                                    {' '}
                                    <strong>{(first[chunkLength][part] / all * 100).toFixed(2)}</strong>%
                                    {' '}
                                    {t('end.wordsUsed', { count: 100 })}
                                </span>
                            </li>)}
                        </ul>
                    </div>);
                })}
            </div>
            <h4>{t('statistics.languageTitleInTheMiddle')}</h4>
            <div className="about-language-neighbours-columns">
                {[2, 3, 4].map((chunkLength) => {
                    const key  = `length${chunkLength}` as 'length2' | 'length3' | 'length4';

                    return (<div key={key}>
                        <ul className="about-language-neighbours-list--start about-language-neighbours-list--end">
                            {middleKeys[key].map((part) => <li key={part} className={clsx('has-tooltip', {
                                'has-tooltip-from-left': chunkLength === 2,
                                'has-tooltip-from-right': chunkLength === 4,
                            })}>
                                {part}
                                <span
                                    className="tooltip"
                                    dangerouslySetInnerHTML={{
                                        __html: t(`statistics.languageDescriptionHighestLetterForCommon`, { // It works fine here
                                            maxletter: `"${part}"`,
                                            maxLetterValue: `<strong>${(middle[chunkLength][part] / all).toFixed(3)}</strong>`,
                                    })}}
                                />
                            </li>)}
                        </ul>
                    </div>);
                })}
            </div>
            <h4>{t('statistics.languageTitleInTheEnd')}</h4>
            <div className="about-language-neighbours-columns">
                {[2, 3, 4].map((chunkLength) => {
                    const key  = `length${chunkLength}` as 'length2' | 'length3' | 'length4';

                    return (<div key={key}>
                        <ul className="about-language-neighbours-list--start">
                            {lastKeys[key].map((part) => <li key={part} className="has-tooltip">
                                {part}.
                                <span className="tooltip">
                                    {' "'}
                                    {part}
                                    {'" '}
                                    {t('end.in', { postProcess: 'interval', count: 100 })}
                                    {' '}
                                    <strong>{(last[chunkLength][part] / all * 100).toFixed(2)}</strong>%
                                    {' '}
                                    {t('end.wordsUsed', { count: 100 })}
                                </span>
                            </li>)}
                        </ul>
                    </div>);
                })}
            </div>
        </section>
    )
};

export default AboutLanguageNeighbours;
