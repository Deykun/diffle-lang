interface Params {
    wordToGuess: string,
    wordsWithIndexes: {
        word?: string,
        key: string,
        index: number,
    }[],
    subtotals: {
        correct: number,
        position: number,
        incorrect: number,
        typedKnownIncorrect: number,
    },
}

interface ChunkInfo {
    word?: string,
    key: string,
    index: number,
}

export const getChunkKeyPartWithPreviousUsedAsShadow = (key: string, previousKey: string | undefined = '') => {
    if (key.length !== 3) {
        throw `Key must be 3 letters in length. key: ${key}, previousKey: ${previousKey}`;
    }

    if (key === previousKey) {
        return '';
    }

    if (key.slice(0, 2) === previousKey.slice(0, 2)) {
        return key.slice(2, 3);
    }

    if (key.slice(0, 1) === previousKey.slice(0, 1)) {
        return key.slice(1, 3);
    }

    return key;
};

export const getFullChunkKeyWithPreviousUsedAsShadow = (key: string | undefined = '', previousKey: string | undefined = '') => {
    if (key.length === 3) {
        return key;
    }

    if (previousKey.length !== 3) {
        // If the first one is missing then this has to be filled
        throw 'Shadow key must be 3 letters in length';
    }

    return `${previousKey.slice(0, 3 - key.length)}${key}`;
};

/*
    Why?
    korzyść, korzeń, korytarz, kora, koran

    Would normally do: kor-123.kor-420|kor-312|kor-12|kor-1098 etc.
    Mapping above shorts it to: kor-123|420|312|12|1098

    That hash is later converted to base64 and put as a GET parameter,
    so the goal is to make it as short as possible and usually,
    people start to use words starting with the same beginning.
*/

export const transformChunkInfoIntoShortKey = (wordsWithIndexes: ChunkInfo[]): string => {
    return wordsWithIndexes.map(({ key, index }, arrayIndex) => {
        const keyToUse = getChunkKeyPartWithPreviousUsedAsShadow(key, wordsWithIndexes[arrayIndex - 1]?.key);

        return !keyToUse ? index.toString(16) : `${keyToUse}-${index.toString(16)}`;
    }).join('.');
};

export const transformShortKeyToChunkInfo = (shortKey: string): ChunkInfo[] => {
    const compactedChunks = shortKey.split('.');

    const chunksInfos: ChunkInfo[] = [];
    
    compactedChunks.forEach((compactedChunk, index) => {
        const isRegularCompactedChunk = compactedChunk.includes('-');

        if (isRegularCompactedChunk) {
            const [keyToUse, indexHex] = compactedChunk.split('-');

            const key = getFullChunkKeyWithPreviousUsedAsShadow(keyToUse, chunksInfos[index - 1]?.key)

            const indexToSave = parseInt(indexHex, 16);

            chunksInfos[index] =  { key, index: indexToSave };

            return;
        } else {
            const prevKey = chunksInfos[index - 1].key;

            chunksInfos[index] =  { key: prevKey, index: parseInt(compactedChunk, 16) };
        }
    });

    return chunksInfos;
};

export const getUrlHashForGameResult = ({
    wordToGuess = '',
    wordsWithIndexes = [],
    subtotals: {
        correct = 0,
        position = 0,
        incorrect = 0,
        typedKnownIncorrect,
    },
}: Params) => {
    const hasEnoughData = !(!wordToGuess || wordsWithIndexes.length === 0);

    if (!hasEnoughData) {
        return '';
    }

    const partsToHash = [
        wordToGuess,
        // values below will be used as a checksum
        correct,
        position,
        incorrect,
        typedKnownIncorrect,
    ];

    const compactedWords = transformChunkInfoIntoShortKey(wordsWithIndexes);

    const hashedValue = [
        ...partsToHash,
        compactedWords
    ].join('.');

    // Cut base64 sometimes produces the right hash, with !()! we can confirm that entire hash has been copied
    return `!(${hashedValue})!`;
};

export const getGameResultFromUrlHash = async (urlHash: string) => {
    const [
        wordToGuess,
        correctString,
        positionString,
        incorrectString,
        typedKnownIncorrectString,
        ...compactedWords
    ] = urlHash.replace('!(', '').replace(')!', '').split('.');

    const keysWithIndexes = transformShortKeyToChunkInfo(compactedWords.join('.'));

    return {
        wordToGuess,
        correct: Number(correctString),
        position:  Number(positionString),
        incorrect:  Number(incorrectString),
        typedKnownIncorrect: Number(typedKnownIncorrectString),
        keysWithIndexes,
    };
};

export const maskValue = (value: string) => {
    try {
        const encodedValue = encodeURIComponent(value);

        // const base64Value = Buffer.from(encodedValue).toString('base64');
        const base64Value = btoa(encodedValue);
        const base64Reversed = Array.from(base64Value).reverse().join('');

        const base64ReversedNoEqual = base64Reversed.replaceAll('=', '');

        return base64ReversedNoEqual;
    } catch {
        return '';
    }
};

export const demaskValue = (base64ReversedNoEqual: string) => {
    try {
        const base64Reversed = decodeURIComponent(base64ReversedNoEqual);
        const base64Value = Array.from(base64Reversed).reverse().join('');
    
        // const value = Buffer.from(base64Value, 'base64').toString('ascii');
        const encodedValue = atob(base64Value);
    
        const value = decodeURIComponent(encodedValue);
    
        return value;
    } catch (error) {
        return '';
    }
};
