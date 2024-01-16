import chalk from 'chalk';

export const removeDiacratics = (word) => word
    .replaceAll('ą', 'a')
    .replaceAll('ć', 'c')
    .replaceAll('ę', 'e')
    .replaceAll('ł', 'l')
    .replaceAll('ń', 'n')
    .replaceAll('ó', 'o')
    .replaceAll('ś', 's')
    .replaceAll('ź', 'z')
    .replaceAll('ż', 'z');

export const getIsWordWithSpecialCharacters = (word) => removeDiacratics(word) !== word;

export const getNormalizedKey = (word, language) => {
    if (word.length === 2) {
        return '2ch';
    }

    if (word.length < 3) {
        return;
    }

    if (word.length === 3) {
        return '3ch';
    }

    if (language === 'pl') {
        /* 
            "Nie" means no/not and in Polish you connect those for a lot of words ex:
            nieżyje - not alive, nieładny - not pretty etc.
            
            So it gets its own subkey.
        */
        const key = word.startsWith('nie') ? word.slice(0, 6) : word.slice(0, 3);

        return removeDiacratics(key);
    }

    return word.slice(0, 3);
};

export const consoleStatistics = (statistics) => {
    console.log(`Spellchecker:`);
    console.log(` - accepted words: ${chalk.green(statistics.spellchecker.accepted.all)}`);
    console.log(`   - without special characters: ${chalk.green(statistics.spellchecker.accepted.withSpecialCharacters)}`);
    console.log(`   - with special characters: ${chalk.green(statistics.spellchecker.accepted.withoutSpecialCharacters)}`);
    console.log(' ');
    console.log(`Winning:`);
    console.log(` - accepted words: ${chalk.green(statistics.winning.accepted.all)}`);
    console.log(`   - without special characters: ${chalk.green(statistics.winning.accepted.withSpecialCharacters)}`);
    console.log(`   - with special characters: ${chalk.green(statistics.winning.accepted.withoutSpecialCharacters)}`);
    console.log(` - rejected words: ${chalk.red(statistics.winning.rejected.all)}`);
    console.log(`   - too long: ${chalk.red(statistics.winning.rejected.tooLong)}`);
    console.log(`   - too short: ${chalk.red(statistics.winning.rejected.tooShort)}`);
    console.log(`   - probably a swear word: ${chalk.red(statistics.winning.rejected.censored)}`);

    if (statistics.winning.lettersNotAcceptedInWinningWord.length > 0) {
        console.log(`   - not accepted letters (${statistics.winning.lettersNotAcceptedInWinningWord.join(',')}): ${chalk.red(statistics.winning.rejected.wrongLetters)} `);
    }

    console.log(' ');
}
