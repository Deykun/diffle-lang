import fs from 'fs';
import chalk from 'chalk';

const MINIMUM_LENGTH_FOR_A_WINNING_WORD = 5;

const spellcheckerDictionary = fs.readFileSync('./resources/SJP/dictionary.txt', 'utf-8');
const winningDictionary = fs.readFileSync('./resources/FreeDict/dictionary.txt', 'utf-8');

const spellcheckerWords = spellcheckerDictionary.split(/\r?\n/);
const totalSpellcheckerWords = spellcheckerWords.length;

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))];
const totalWinningWords = winningWords.length;

let catalog = {
    words: 0,
    items: [],
};

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
        .replaceAll('ą', 'a')
        .replaceAll('ć', 'c')
        .replaceAll('ę', 'e')
        .replaceAll('ł', 'l')
        .replaceAll('ń', 'n')
        .replaceAll('ó', 'o')
        .replaceAll('ś', 's')
        .replaceAll('ź', 'z')
        .replaceAll('ż', 'z');
}

const closeIndex = (index, pathPattern, { withCatalog = false, total} = {}) => {
    const { key, words } = currentIndex;

    if (key && words.length > 0) {
        const uniqueWords = [...new Set(words)];

        if (withCatalog) {
            const endIndex = catalog.words + uniqueWords.length;

            catalog.items.push({
                key,
                endIndex,
                keyWords: uniqueWords.length,
            });

            catalog.words = endIndex;
        }

        tempIndex[key] = { key, words: uniqueWords };

        const progressPercent = (index && total) ? 100 * (index / total) : undefined;

        const message = [
            `Chunk "${key}" saved with ${uniqueWords.length} words`,
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

console.log(' ');
console.log(chalk.blue(`Creating spelling chunks from ${totalSpellcheckerWords} words...`));
console.log(' ');

spellcheckerWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, 3);

    if (key) {
        if (key === currentIndex.key) {
            currentIndex.words.push(word);
        } else {
            closeIndex(index, 'spelling/chunk', { total: totalSpellcheckerWords });

            openIndexIfNeeded(word);
        }
    }
});

closeIndex(totalSpellcheckerWords, 'spelling/chunk', { total: totalSpellcheckerWords });

console.log(' ');
console.log(chalk.blue(`Creating winning chunks from ${totalWinningWords} words...`));
console.log(' ');

let accepted = 0;

winningWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, 3);

    if (key && word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD) {
        if (tempIndex[key]?.words.includes(word)) {
            accepted = accepted + 1;
            if (key === currentIndex.key) {
                currentIndex.words.push(word);
            } else {
                if (currentIndex.key) {
                    closeIndex(index, 'winning/chunk', { withCatalog: true, total: totalWinningWords });
                }
        
                openIndexIfNeeded(word);
            }
        }
    }
});

closeIndex(totalWinningWords, 'winning/chunk', { withCatalog: true, total: totalWinningWords });

// We can't accept words that are present in one dictionary and not in another
let rejected = totalWinningWords - accepted;

console.log(' ');
console.log(chalk.blue(`Winning chunks created.`));
console.log(` - accepted: ${chalk.green(accepted)} `);
console.log(` - rejected: ${chalk.red(rejected)} `);

fs.writeFileSync(`public/dictionary/catalog.json`, JSON.stringify(catalog));
