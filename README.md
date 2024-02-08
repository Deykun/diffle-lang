# DIFFLE 🇨🇿 🇬🇧 🇵🇱

A Wordle-like game without a character limit, where every used word gives hints about the position and order of letters in the solution.

The website: https://deykun.github.io/diffle-lang/

Supported languages:
 - Czech 🇨🇿
 - English 🇬🇧
 - Polish 🇵🇱
    - the biggest Polish community: https://www.hejto.pl/tag/diffle

## Polskie DIFFLE 🇵🇱
Najwięlsza polska społeczność: https://www.hejto.pl/tag/diffle

DIFFLE gra jak Wordle (po polsku, bez limitu znaków), każde użyte słowo podpowiada pozycję i kolejność liter w haśle.

# Resources

### Original DIFFLE
 - https://hedalu244.github.io/diffle/
 - https://github.com/hedalu244/diffle

### Dictionaries
 - https://sjp.pl - the Polish spellechecker dictionary
 - https://github.com/dwyl - the English spellchecker dictionary
 - https://freedict.org - the Polish & English winning words dictionary

### Other
 - https://iconmonstr.com/ - icons
 - https://github.com/lipis/flag-icons - flags

# Cool features

## Spellchecker API
This project is 100% GitHub-hosted, so it doesn't have a backend server. The spellchecker dictionary is usually over 45MB. In this repository, this dictionary is cut into thousands of JSON files. If someone looks for "łódź," the word is converted to "lodz", limited to 3 characters, and pl/chunk-lod.json is fetched to check if it's there. It's a light, quick, and faux serverless solution.

## A reactive keyboard
I challenge you to find a better keyboard in any Wordle game. This keyboard reacts and provides hints while typing, with optional vibrations (which are longer when an incorrect letter is typed).

## A spoilers free share
You can share your result with a hashed URL which, after winning your daily game, will display the words from the result.