# Dodawanie języka
1. Translate the app and create a new language file in `src/locales/[langCode].json` (there is README.md there and en.json)
2. Import that new translations to `src/i18n.ts`
3. Find open lices dictionaries for the langue (that is the hardest part sometime a good phrases to search is "dictionary", "wordlist", "spellchecker", using those words not in english can be helpful because there are dictionaries that are documented in english), I personally consider 200-500k words in spellchecker to be okay, winning words usually are close to 16k (two dictionaries are matched against eachater to find more user friendly form of the word FreeDict worsk really good for it)
4. Create new dictionary folder in `resources/[langCode]` with dicitonaries
5. Create `public/dicitonary/[langCode]` template 
7. Add special characters to the `removeDiacratics` function
6. Add `build-[langCode]-dictionary.mjs` in `scripts` folder
8. Add `build-[langCode]` to `package.json` `scripts`
9. Add language to `SUPPORTED_DICTIONARY_BY_LANG` in `src/const.ts`
10. Add flag to `public/flags` from (https://github.com/lipis/flag-icons (4x3) - use svg compressor
11. Add [langCode] as a `language` allowed string in `RootGameState` in `types.d.ts`
12. Add example words in `src\components\Panes\Help\constants.ts`
14. Add srr index for language `public-ssr/[langCode]` don't forget about custom open graph image