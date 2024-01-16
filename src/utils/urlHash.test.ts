import { describe, expect, it } from '@jest/globals';

import {
    getChunkKeyPartWithPreviousUsedAsShadow,
    getFullChunkKeyWithPreviousUsedAsShadow,
    transformChunkInfoIntoShortKey,
    transformShortKeyToChunkInfo,
    getUrlHashForGameResult,
} from './urlHash';

describe('', () => {
    describe('getChunkKeyPartWithPreviousUsedAsShadow', () => {
        it('diffrent keys should be just returned', () => {
            expect(getChunkKeyPartWithPreviousUsedAsShadow('abc', 'kod')).toEqual('abc');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('tes', 'kod')).toEqual('tes');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('bot', 'kod')).toEqual('bot');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('pol', 'kod')).toEqual('pol');
        });

        it('first two letter are the same only the last should be returned', () => {
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kot', 'kod')).toEqual('t');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kos', 'kod')).toEqual('s');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kow', 'kod')).toEqual('w');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kop', 'kod')).toEqual('p');
        });

        it('first letter is the same should last two be returned', () => {
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kat', 'kod')).toEqual('at');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kas', 'kod')).toEqual('as');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kaw', 'kod')).toEqual('aw');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kap', 'kod')).toEqual('ap');
        });

        it('the key are the same so empty strin should be returned', () => {
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kod', 'kod')).toEqual('');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('mys', 'mys')).toEqual('');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kaw', 'kaw')).toEqual('');
            expect(getChunkKeyPartWithPreviousUsedAsShadow('kap', 'kap')).toEqual('');
        });
    });

    describe('getChunkKeyPartWithPreviousUsedAsShadow', () => {
        it('should fill based on shadow', () => {
            expect(getFullChunkKeyWithPreviousUsedAsShadow('', 'kod')).toEqual('kod');
            expect(getFullChunkKeyWithPreviousUsedAsShadow('s', 'kod')).toEqual('kos');
            expect(getFullChunkKeyWithPreviousUsedAsShadow('rz', 'kod')).toEqual('krz');
            expect(getFullChunkKeyWithPreviousUsedAsShadow('kod', 'kod')).toEqual('kod');
        });
    });
})

describe('ChunkInfo and ShortedKey', () => {
    it('should transform to string and from string to array', () => {
        const chunkInfo = [
            { word: 'anysz', key: 'any', index: 123 },
            { word: 'kostka', key: 'kos', index: 562 },
            { word: 'kwota', key: 'kwo', index: 1034 },
        ];

        const shortKey = 'any-7b.kos-232.wo-40a';

        const resultedShortedKey = transformChunkInfoIntoShortKey(chunkInfo);

        expect(resultedShortedKey).toEqual(shortKey);

        const resultedChunkInfo = transformShortKeyToChunkInfo(resultedShortedKey);

        expect(resultedChunkInfo).toEqual(
            chunkInfo.map(({ key, index }) => ({ key, index })),
        );
    });

    it('should remove remove keys but restore them in string if diffrent word is used "test"', () => {
        const chunkInfo = [
            { word: 'emo', key: 'emo', index: 1000 },
            { word: 'emocja', key: 'emo', index: 2726 },
            { word: 'emocjach', key: 'emo', index: 1301 },
            { word: 'test', key: 'tes', index: 3451 },
            { word: 'emocją', key: 'emo', index: 2501 },
            { word: 'emocje', key: 'emo', index: 4601 },
            { word: 'emocję', key: 'emo', index: 1813 },
            { word: 'krewny', key: 'kre', index: 801 },
        ];

        /*
            So this is compacted:
            emo-3e8.aa6.515.tes-d7b.emo-9c5.11f9.715.kre-321

            And it could be:
            emo-1000.emo-2726.emo-1301.test-3451.emo-2501.emo-4601.emo-1813.kre-801
        */
        const shortKey = 'emo-3e8.aa6.515.tes-d7b.emo-9c5.11f9.715.kre-321';

        const resultedShortedKey = transformChunkInfoIntoShortKey(chunkInfo);

        expect(resultedShortedKey).toEqual(shortKey);

        const resultedChunkInfo = transformShortKeyToChunkInfo(resultedShortedKey);

        expect(resultedChunkInfo).toEqual(
            chunkInfo.map(({ key, index }) => ({ key, index })),
        );
    });

    it('should use only letter that are needed', () => {
        // A reasonable game: someone guessed 'p,' then 'pu,' and finally 'puc.' However at 'puc,' new chunks aren't really needed.
        const chunkInfo = [
            { word: 'pies', key: 'pie', index: 1000 },
            { word: 'pustka', key: 'pus', index: 1001 },
            { word: 'puch', key: 'puc', index: 1002 },
            { word: 'puchaty', key: 'puc', index: 1003 },
        ];

        const shortKey = 'pie-3e8.us-3e9.c-3ea.3eb';

        const resultedShortedKey = transformChunkInfoIntoShortKey(chunkInfo);

        expect(resultedShortedKey).toEqual(shortKey);

        const resultedChunkInfo = transformShortKeyToChunkInfo(resultedShortedKey);

        expect(resultedChunkInfo).toEqual(
            chunkInfo.map(({ key, index }) => ({ key, index })),
        );
    });

    it('should work with words starting with "nie" (it has longer keys)', () => {
        const chunkInfo = [
            { word: 'niebieski', key: 'niebie', index: 999 },
            { word: 'pies', key: 'pie', index: 1000 },
            { word: 'pustka', key: 'pus', index: 1001 },
            { word: 'nietaki', key: 'nietak', index: 1003 },
            { word: 'puch', key: 'puc', index: 1003 },
            { word: 'puchaty', key: 'puc', index: 1004 },
        ];

        const shortKey = 'niebie-3e7.pie-3e8.us-3e9.nietak-3eb.puc-3eb.3ec';

        const resultedShortedKey = transformChunkInfoIntoShortKey(chunkInfo);

        expect(resultedShortedKey).toEqual(shortKey);

        const resultedChunkInfo = transformShortKeyToChunkInfo(resultedShortedKey);

        expect(resultedChunkInfo).toEqual(
            chunkInfo.map(({ key, index }) => ({ key, index })),
        );
    });

    it('Should work with a various number of lengths of "nie" keys.', () => {
        const chunkInfo = [
            { word: 'niebieski', key: 'niebie', index: 999 },
            { word: 'niemy', key: 'niemy', index: 999 },
            { word: 'domek', key: 'dom', index: 999 },
            { word: 'nie', key: 'nie', index: 999 },
            { word: 'niegra', key: 'niegra', index: 999 },
            { word: 'niegry', key: 'niegry', index: 999 },
        ];

        const shortKey = 'niebie-3e7.niemy-3e7.dom-3e7.nie-3e7.niegra-3e7.niegry-3e7';

        const resultedShortedKey = transformChunkInfoIntoShortKey(chunkInfo);

        expect(resultedShortedKey).toEqual(shortKey);

        const resultedChunkInfo = transformShortKeyToChunkInfo(resultedShortedKey);

        expect(resultedChunkInfo).toEqual(
            chunkInfo.map(({ key, index }) => ({ key, index })),
        );
    });
});

describe('getUrlHashForGameResult', () => {
    const workingExample = {
        wordToGuess: 'test',
        wordsWithIndexes: [
            { word: 'kasa', key: 'kas', index: 123 },
            { word: 'test', key: 'tes', index: 345 }
        ],
        words: 2,
        letters: 8,
        subtotals: {
            correct: 5,
            position: 0,
            incorrect: 3,
            typedKnownIncorrect: 0,
        },
    };

    describe('Should reject empty', () => {
        it('wordToGuess = "" returns empty string', () => {
            expect(getUrlHashForGameResult({ ...workingExample, wordToGuess: '' })).toEqual('');
        });
    
        it('words indexes returns empty string', () => {
            expect(getUrlHashForGameResult({ ...workingExample, wordsWithIndexes: [] })).toEqual('');
        });
    });

    it('right inputshould generate the correct hash', () => {
        expect(getUrlHashForGameResult({ ...workingExample })).toEqual('!(test.5.0.3.0.kas-7b.tes-159)!');
    });
});
