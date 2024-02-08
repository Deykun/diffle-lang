import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AffixStatus, Word as WordInterface } from '@common-types';

import Word from '@components/Words/Word'

import './Help.scss'

interface Props {
    helpGuesses: WordInterface[],
    tEnd?: string,
}

const HelpWords = ({ helpGuesses, tEnd = '' }: Props) => {
    const { t } = useTranslation();



    const [
        wordExampleNotMatch,
        wordExampleOrder,
        wordExampleInRow,
        wordExampleStartAndEnd,
        wordExampleWin,
    ] = helpGuesses;

    const {
        order1,
        order2,
        inRow,
        firstAndLast,
    } = useMemo(() => {
        if (helpGuesses.length === 0) {
            return { };
        }

        const lines: {
            [key: string]: {
                message: string,
                values: {
                    [key: string]: string
                }
            }
        } = {};

        const orderAffixes = wordExampleOrder.affixes.filter(({ type }) => type === AffixStatus.Correct || type === AffixStatus.Position);
        const orderPositionIndex = orderAffixes.findIndex(({ type }) => type === AffixStatus.Position);
        const orderLetters = orderAffixes.map(({ text }) => text.toLocaleUpperCase());
        const orderLetterPosition = orderLetters[orderPositionIndex];

        if (orderPositionIndex === 0) {
            lines.order1 = { message: 'help.correctLetters', values: { correct1: orderLetters[1], correct2: orderLetters[2] } };
            lines.order2 = { message: 'help.positionBefore', values: { position: orderLetterPosition, closestCorrect: orderLetters[1] } };
        } else if (orderPositionIndex === 1) {
            lines.order1 = { message: 'help.correctLetters', values: { correct1: orderLetters[0], correct2: orderLetters[2] } };
            lines.order2 = { message: 'help.positionBetween', values: { position: orderLetterPosition } };
        } else if (orderPositionIndex === 2) {
            lines.order1 = { message: 'help.correctLetters', values: { correct1: orderLetters[0], correct2: orderLetters[1] } };
            lines.order2 = { message: 'help.positionAfter', values: { position: orderLetterPosition, closestCorrect: orderLetters[1] } };
        }

        const rowAffixes = wordExampleInRow.affixes.filter(({ type, text }) => type === AffixStatus.Correct && text.length > 1 );

        lines.inRow = { message: 'help.inRow', values: { letters: rowAffixes[0].text.toLocaleUpperCase() } };

        const firstAffix = wordExampleStartAndEnd.affixes.at(0);
        const lastAffix = wordExampleStartAndEnd.affixes.at(-1);

        lines.firstAndLast = { message: 'help.firstAndLast', values: { first: firstAffix?.text?.toLocaleUpperCase() || '', last: lastAffix?.text?.toLocaleUpperCase() || '' } };


        return lines;
    }, [helpGuesses.length, wordExampleInRow, wordExampleOrder, wordExampleStartAndEnd]);

    if (helpGuesses.length === 0) {
        return null
    }

    return (
        <>
            <h2 className="title">{t(`help.exampleTitle${tEnd}`)}</h2>
            <Word guess={wordExampleNotMatch} />
            <p>{t('help.incorrectLettersTip')}</p>
            <Word guess={wordExampleOrder} />
            <p>
                <span dangerouslySetInnerHTML={ { __html: t(order1.message, order1.values) } }></span>
                <br />
                <span dangerouslySetInnerHTML={ { __html: t(order2.message, order2.values) } }></span>
            </p>
            <Word guess={wordExampleInRow} />
            {inRow && <p dangerouslySetInnerHTML={{ __html: t(inRow.message, inRow.values) } }></p>}
            <Word guess={wordExampleStartAndEnd} />
            {firstAndLast && <p dangerouslySetInnerHTML={{ __html: t(firstAndLast.message, firstAndLast.values) } }></p>}
            <Word guess={wordExampleWin} />
            <p>{t('help.winingWordMessage')}</p>
        </>
    )
};

export default HelpWords;
