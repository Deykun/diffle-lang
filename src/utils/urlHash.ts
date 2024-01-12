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
        const isTheSameKey = key === wordsWithIndexes[arrayIndex - 1]?.key;

        return isTheSameKey ? `${index.toString(16)}` : `${key}-${index.toString(16)}`;
    }).join('.');
};

export const transformShortKeyToChunkInfo = (shortKey: string): ChunkInfo[] => {
    const compactedChunks = shortKey.split('.');

    const chunksInfos: ChunkInfo[] = [];
    
    compactedChunks.forEach((compactedChunk, index) => {
        const isRegularCompactedChunk = compactedChunk.includes('-');

        if (isRegularCompactedChunk) {
            const [key, indexHex] = compactedChunk.split('-');
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

    // Cut base64 sometimes produces the right hash, with !()! we can confirm that entire has has been copied
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
