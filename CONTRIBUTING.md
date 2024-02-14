# Adding a New Language
1. Translate the app stting and create a new language file in `src/locales/[langCode].json` (refer to the `src/locales/README.md` and en.json for guidance).
2. Import the new translations into `src/i18n.ts`.
3. Search for open source dictionaries for the language (this step can be challenging). Useful search phrases include "dictionary", "wordlist", "hunspell" and "spellchecker". It is advisable to use non-English terms in your search to find dictionaries not documented in English. Personally, I recommend dictionaries with 200-500k words for spellchecking, with an additional dicitonary that produces 16k winning words (smaller dictionary). FreeDict is a reliable resource for this purpose.
4. Create a new dictionary folder in `resources/[langCode]` with the acquired dictionaries.
5. Create `public/dictionary/[langCode]` with subcatalogs.
6. Enhance the `removeDiacritics` function to include special characters used in the new language.
7. Create the `build-[langCode]-dictionary.mjs` script in the `scripts` folder.
8. Include `build-[langCode]` in the `scripts` section of `package.json`.
9. Add the new language to `SUPPORTED_DICTIONARY_BY_LANG` in `src/const.ts`.
10. Incorporate the flag for the language from [Flag Icons](https://github.com/lipis/flag-icons) (4x3). Compress it with https://jakearchibald.github.io/svgomg/.
11. Update `language` as an allowed string in the `RootGameState` within `types.d.ts`.
12. Include example words in `src\components\Panes\Help\constants.ts`. The easiest way to find them is to override getWordToGuess with our expected word and play to identify words that can be used as examples.
13. Add an srr index for the language at `public-ssr/[langCode]`
14. Remember to include a custom open graph image.

Feel free to adjust as needed for your specific context!
