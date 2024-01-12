import { describe, expect, it } from '@jest/globals';

import {
    transformChunkInfoIntoShortKey,
    transformShortKeyToChunkInfo,
    getUrlHashForGameResult,
} from './urlHash';

describe('ChunkInfo and ShortedKey', () => {
    it('should transform to string and from string to array', () => {
        const chunkInfo = [
            { word: 'anysz', key: 'any', index: 123 },
            { word: 'kostka', key: 'kos', index: 562 },
            { word: 'kwota', key: 'kwo', index: 1034 },
        ];

        const shortKey = 'any-7b.kos-232.kwo-40a';

        const resultedShortedKey = transformChunkInfoIntoShortKey(chunkInfo);

        expect(resultedShortedKey).toEqual(shortKey);

        const resultedChunkInfo = transformShortKeyToChunkInfo(resultedShortedKey);

        expect(resultedChunkInfo).toEqual(
            chunkInfo.map(({ key, index }) => ({ key, index })),
        );
    });

    it('should remove repeted keys in shorted version', () => {
        const chunkInfo = [
            { word: 'emo', key: 'emo', index: 1000 },
            { word: 'emocja', key: 'emo', index: 2726 },
            { word: 'emocjach', key: 'emo', index: 1301 },
            { word: 'test', key: 'test', index: 3451 },
            { word: 'emocją', key: 'emo', index: 2501 },
            { word: 'emocje', key: 'emo', index: 4601 },
            { word: 'emocję', key: 'emo', index: 1813 },
            { word: 'krewny', key: 'kre', index: 801 },
        ];

        /*
            So this is compacted:
            emo-3e8.aa6.515.test-d7b.emo-9c5.11f9.715.kre-321
            In Base64 -> ZW1vLTNlOC5hYTYuNTE1LnRlc3QtZDdiLmVtby05YzUuMTFmOS43MTUua3JlLTMyMQ==

            And it could be:
            emo-1000.emo-2726.emo-1301.test-3451.emo-2501.emo-4601.emo-1813.kre-801
            In Base64 -> ZW1vLTEwMDAuZW1vLTI3MjYuZW1vLTEzMDEudGVzdC0zNDUxLmVtby0yNTAxLmVtby00NjAxLmVtby0xODEzLmtyZS04MDE=
        */
        const shortKey = 'emo-3e8.aa6.515.test-d7b.emo-9c5.11f9.715.kre-321';

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
