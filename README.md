# DIFFLE 🇨🇿 🇬🇧 🇵🇱

A Wordle-like game without a character limit, where every used word gives hints about the position and order of letters in the solution.

The website: https://deykun.github.io/diffle-lang/

Supported languages:
 - Czech 🇨🇿 (since 08.02.2024)
 - English 🇬🇧 (since 19.01.2024)
 - Polish 🇵🇱 (since 30.07.2023)
    - the biggest Polish community: https://www.hejto.pl/tag/diffle

## Polskie DIFFLE 🇵🇱
DIFFLE gra jak Wordle (po polsku, bez limitu znaków), każde użyte słowo podpowiada pozycję i kolejność liter w haśle.

Najwięlsza polska społeczność: https://www.hejto.pl/tag/diffle

# Cool features ✨

## Spellchecker API
This project is 100% GitHub-hosted, so it doesn't have a backend server. The spellchecker dictionary is usually over 45MB. In this repository, the dictionary is divided into thousands of JSON files. When someone searches for "łódź", the word is converted to "lodz", limited to 3 characters, and pl/chunk-lod.json is fetched to check if it's there. It's a lightweight, quick, and serverless-like solution.

## A reactive keyboard
I challenge you to find a better keyboard in any Wordle game. This keyboard reacts and provides hints while typing, with optional vibrations (which are longer when an incorrect letter is typed).

## Spoiler-Free sharing
You can share your result with a hashed URL, which after winning your daily game will display the words from the result.

# Resources 🗃️

### Original DIFFLE
 - https://hedalu244.github.io/diffle/
 - https://github.com/hedalu244/diffle

### Dictionaries
 - https://gitlab.com/strepon/czech-cc0-dictionaries - Czech spellchecker dictionary
 - https://omegawiki.org/ via https://www.dicts.info/uddl.php - Czech winning words dictionary
 - https://sjp.pl - Polish spellechecker dictionary
 - https://github.com/dwyl - English spellchecker dictionary
 - https://freedict.org - Polish & English winning words dictionary

### Other
 - https://iconmonstr.com/ - icons
 - https://github.com/lipis/flag-icons - flags
