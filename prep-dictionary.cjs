const fs = require('fs');

const allFileContents = fs.readFileSync('./public/dictionary/sjp-20230709.txt', 'utf-8');

let catalog = {};

let currentIndex = {
    key: 'aaa',
    words: [],
};

const getNormalizedWord = word => word
    .replaceAll('ą', 'a')
    .replaceAll('ć', 'c')
    .replaceAll('ę', 'e')
    .replaceAll('ł', 'l')
    .replaceAll('ń', 'n')
    .replaceAll('ó', 'o')
    .replaceAll('ś', 's')
    .replaceAll('ź', 'z')
    .replaceAll('ż', 'z');

const closeIndex = () => {
    const { key, words } = currentIndex;

    if (key && words.length > 0) {

        catalog[key] = { key, total: words.length };

        console.log(`Key ${key} saved with ${words.length}`);

        fs.writeFileSync(`public/dictionary/chunks/chunk-${currentIndex.key}.json`, JSON.stringify(currentIndex.words));

        currentIndex = {};
    }
}

const openIndexIfNeeded = word => {
    if (word.length < 3) {
        return;
    }
    // str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    currentIndex = {
        key: getNormalizedWord(word).slice(0, 3),
        words: [],
    };
}

allFileContents.split(/\r?\n/).forEach((word, index) =>  {
    if (word.startsWith(currentIndex.key) || getNormalizedWord(word).startsWith(currentIndex.key)) {
        currentIndex.words.push(word);
    } else {
        closeIndex();

        openIndexIfNeeded(word);
    }
});

fs.writeFileSync(`public/dictionary/catalog.json`, JSON.stringify(catalog));
