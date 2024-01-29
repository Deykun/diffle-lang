# Dodawanie języka
1. Translate the app and create a new language file in `src/locales/[langCode].json` (there is README.md there and en.json)
2. Import that new translations to `src/i18n.ts`
3. Find open lices dictionaries for the langue (that is the hardest part sometime a good phrases to search is "dictionary", "wordlist", "spellchecker"), I personally consider 200-500k words in spellchecker to be okay, winning words usually are close to 16k (two dictionaries are matched against eachater to find more user friendly form of the word FreeDict worsk really good for it)
4. Create new dictionary folder in `resources/[langCode]`
5. Add `build-[langCode]-dictionary.mjs` in `scripts`