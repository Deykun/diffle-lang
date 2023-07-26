import fs from 'fs';
import chalk from 'chalk';

const MINIMUM_LENGTH_FOR_A_WINNING_WORD = 5;

const spellcheckerDictionary = fs.readFileSync('./resources/SJP/dictionary.txt', 'utf-8');
const winningDictionary = fs.readFileSync('./resources/FreeDict/dictionary.txt', 'utf-8');

const spellcheckerWords = [...new Set(spellcheckerDictionary.split(/\r?\n/).filter(Boolean))].map(word => word.toLowerCase());
const totalSpellcheckerWords = spellcheckerWords.length;

const winningWords = [...new Set(winningDictionary.split(/\r?\n/).map(line => (line.replace(/\s+/g,' ').split(' '))[0]).filter(Boolean))].map(word => word.toLowerCase());
const totalWinningWords = winningWords.length;

let spellingIndex = {};

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

const closeIndex = (index, pathPattern, { withCatalog = false, total, tempIndex } = {}) => {
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

        // fs.writeFileSync(`public/dictionary/${pathPattern}-${currentIndex.key}.json`, JSON.stringify(currentIndex.words));

        currentIndex = {};
    }
}

console.log(' ');
console.log(chalk.blue(`Creating spelling chunks index from ${totalSpellcheckerWords} words...`));

spellcheckerWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, 3);

    if (key) {
        if (spellingIndex[key]) {
            spellingIndex[key].words.push(word);
        } else {
            spellingIndex[key] = {
                key,
                words: [word],
            };
        }

        const shouldUpdate = index % 75000 === 0;

        if (shouldUpdate) {
            const progressPercent = (index / totalSpellcheckerWords) * 100;

            console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4,0))}% - Creating spelling chunks... - Word "${chalk.cyan(word)}" added to "${chalk.cyan(key)}"`);
        }
    }
});

closeIndex(totalSpellcheckerWords, 'spelling/chunk', { total: totalSpellcheckerWords, tempIndex: spellingIndex });

const totalNumberOfSpellingChunks = Object.keys(spellingIndex).length;

console.log(' ');
console.log(chalk.blue(`Saving ${totalNumberOfSpellingChunks} created chunks...`));

Object.keys(spellingIndex).forEach((key, index) => {
    // Unique words
    spellingIndex[key].words = [...new Set(spellingIndex[key].words)];

    fs.writeFileSync(`public/dictionary/spelling/chunk-${key}.json`, JSON.stringify(spellingIndex[key].words));

    const shouldUpdate = index % 200 === 0;

    if (shouldUpdate) {
        const progressPercent = (index / totalNumberOfSpellingChunks) * 100;

        console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4,0))}% - Saving spelling chunks... - Chunk "${chalk.cyan(key)}" was saved`);
    }
});

console.log(' ');
console.log(chalk.blue(`Creating winning chunks from ${totalWinningWords} words...`));

let accepted = 0;
const winnigIndex = {};

winningWords.forEach((word, index) =>  {
    const key = getNormalizedKey(word, 3);

    if (key && word.length >= MINIMUM_LENGTH_FOR_A_WINNING_WORD) {
        if (spellingIndex[key]?.words.includes(word)) {
            accepted = accepted + 1;


            if (winnigIndex[key]) {
                winnigIndex[key].words.push(word);
            } else {
                winnigIndex[key] = {
                    key,
                    words: [word],
                };
            }

            const shouldUpdate = index % 2500 === 0;

            if (shouldUpdate) {
                const progressPercent = (index / totalWinningWords) * 100;
    
                console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4,0))}% - Creating winning chunks... - Word "${chalk.cyan(word)}" added to "${chalk.cyan(key)}"`);
            }
        }
    }
});

const rejected = totalWinningWords - accepted;

const catalog = {
    words: 0,
    items: [],
};


console.log(' ');
console.log(chalk.blue(`Winning chunks created.`));
// We can't accept words that are present in one dictionary and not in another
console.log(` - accepted words: ${chalk.green(accepted)} `);
console.log(` - rejected words: ${chalk.red(rejected)} `);

const totalNumberOfWinningChunks = Object.keys(winnigIndex).length;

console.log(' ');
console.log(chalk.blue(`Saving ${totalNumberOfWinningChunks} created chunks...`));

Object.keys(winnigIndex).forEach((key, index) => {
    // Unique words
    winnigIndex[key].words = [...new Set(winnigIndex[key].words)];

    fs.writeFileSync(`public/dictionary/winning/chunk-${key}.json`, JSON.stringify(winnigIndex[key].words));

    const endIndex = catalog.words + winnigIndex[key].words.length;

    catalog.items.push({
        key,
        endIndex,
        keyWords: winnigIndex[key].words.length,
    });

    catalog.words = endIndex;

    const shouldUpdate = index % 200 === 0;

    if (shouldUpdate) {
        const progressPercent = (index / totalNumberOfWinningChunks) * 100;

        console.log(`  - ${chalk.green(progressPercent.toFixed(1).padStart(4,0))}% - Saving winning chunks... - Chunk "${chalk.cyan(key)}" was saved`);
    }
});

fs.writeFileSync(`public/dictionary/catalog.json`, JSON.stringify(catalog));

console.log(' ');
console.log(chalk.blue(`Winning catalog saved!`));

console.log(' ');
console.log(chalk.green('Finished!'));
