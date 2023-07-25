import fs from 'fs';
import chalk from 'chalk';

const spellcheckerDictionary = fs.readFileSync('./resources/SJP/dictionary.txt', 'utf-8');
const winningDictionary = fs.readFileSync('./resources/FreeDict/dictionary.txt', 'utf-8');

const spellcheckerWords = spellcheckerDictionary.split(/\r?\n/);
const totalSpellcheckerWords = spellcheckerWords.length;

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))];
const totalWinningWords = winningWords.length;

let catalog = {};

const tempIndex = {};

let currentIndex = {
    key: 'aaa',
    words: [],
};

const getNormalizedKey = word => {
    if (word.length < 3) {
        return;
    }

    /*
        Nie" is the negation marker in Polish, and in Polish, negated adjectives have "nie" as a prefix.

        So it has it's own subkey system.
    */
    const key = word.startsWith('nie') ? word.slice(0, 6) : word.slice(0, 3);

    return key
        .replaceAll('ć', 'c')
        .replaceAll('ę', 'e')
        .replaceAll('ł', 'l')
        .replaceAll('ń', 'n')
        .replaceAll('ó', 'o')
        .replaceAll('ś', 's')
        .replaceAll('ź', 'z')
        .replaceAll('ż', 'z');
}

const closeIndex = (index, pathPattern) => {
    const { key, words } = currentIndex;

    if (key && words.length > 0) {
        const uniqueWords = [...new Set(words)];

        catalog[key] = { key, total: uniqueWords.length };
        tempIndex[key] = { key, words: uniqueWords };

        const progressPercent = index ? 100 * (index / totalSpellcheckerWords) : undefined;

        const message = [
            `Chunk ${key} saved with ${uniqueWords.length} words`,
        ];

        if (progressPercent) {
            message.push(`${chalk.green(progressPercent.toFixed(2))}%`);
        }

        console.log(message.join(' - '));

        fs.writeFileSync(`public/dictionary/${pathPattern}-${currentIndex.key}.json`, JSON.stringify(currentIndex.words));

        currentIndex = {};
    }
}

const openIndexIfNeeded = word => {
    if (word.length < 3) {
        return false;
    }

    currentIndex = {
        key: getNormalizedKey(word, 3),
        words: [word],
    };

    return true;
}


console.log(chalk.blue(`Creating spelling chunks from ${totalSpellcheckerWords} words...`));

spellcheckerWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, 3);

    if (key) {
        if (key === currentIndex.key) {
            currentIndex.words.push(word);
        } else {
            closeIndex(index, 'spelling/chunk');

            openIndexIfNeeded(word);
        }
    }
});

closeIndex(undefined, 'spelling/chunk-');

fs.writeFileSync(`public/dictionary/catalog-spelling.json`, JSON.stringify(catalog));

catalog = {};

console.log(chalk.blue(`Creating winning chunks from ${totalWinningWords} words...`));

spellcheckerWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, 3);

    if (key && key.length >= 3) {
        if (tempIndex[key]?.words.includes(word)) {
            if (key === currentIndex.key) {
                currentIndex.words.push(word);
            } else {
                if (currentIndex.key) {
                    closeIndex(index, 'winning/chunk');
                }
        
                openIndexIfNeeded(word);
            }
        }
    }
});

fs.writeFileSync(`public/dictionary/catalog-winning.json`, JSON.stringify(catalog));

closeIndex(undefined, 'winning/chunk');
