# DIFFLE 🇨🇿 🇩🇪 🇬🇧 🇵🇱

A Wordle-like game without a character limit, where every used word gives hints about the position and order of letters in the solution.

The website: https://deykun.github.io/diffle-lang/

Supported languages:
 - Czech 🇨🇿 (since 08.02.2024)
 - English 🇬🇧 (since 19.01.2024)
 - German 🇩🇪 (since 19.02.2024)
 - Polish 🇵🇱 (since 30.07.2023)
    - the biggest Polish community: https://www.hejto.pl/tag/diffle
 - Spanish 🇪🇸 (since 21.02.2024)

# App screenshots
![diffle lang app screenshots](./app-screenshots.png)

### Polskie DIFFLE 🇵🇱
DIFFLE gra jak Wordle (po polsku, bez limitu znaków), każde użyte słowo podpowiada pozycję i kolejność liter w haśle.

Największa polska społeczność: https://www.hejto.pl/tag/diffle

# Cool features ✨

### Spellchecker API
This project is 100% GitHub-hosted, so it doesn't have a backend server. The spellchecker dictionary is usually over 45MB. In this repository, the dictionary is divided into thousands of JSON files. When someone searches for "łódź", the word is converted to "lodz", limited to 3 characters, and pl/chunk-lod.json is fetched to check if it's there. It's a lightweight, quick, and serverless-like solution.

### About language 
This app has a dedicated subpage with a meta-analysis of the dictionary, including information on the most common letters, length of words, etc.

- https://deykun.github.io/diffle-lang/cs?p=about-language 🇨🇿 
- https://deykun.github.io/diffle-lang/de?p=about-language 🇩🇪 
- https://deykun.github.io/diffle-lang/en?p=about-language 🇬🇧
- https://deykun.github.io/diffle-lang/pl?p=about-language 🇵🇱
- https://deykun.github.io/diffle-lang/es?p=about-language 🇪🇸

### A reactive keyboard
I challenge you to find a better keyboard in any Wordle game. This keyboard reacts and provides hints while typing, with optional vibrations (which are longer when an incorrect letter is typed).

### Spoiler-Free sharing
You can share your result with a hashed URL, which after winning your daily game will display the words from the result.

# Resources 🗃️

### Original DIFFLE
 - https://hedalu244.github.io/diffle/ 🟢
 - https://github.com/hedalu244/diffle

### Dictionaries
 - https://gitlab.com/strepon/czech-cc0-dictionaries - Czech spellchecker dictionary
 - http://slovniky.webz.cz via http://home.zcu.cz/~konopik/ppc/ - Czech winning words dictionary
 - http://www.aaabbb.de/WordList/WordList.php - German spellchecker dictionary (from Wikipedia)
 - https://github.com/dwyl - English spellchecker dictionary
 - https://sjp.pl - Polish spellchecker dictionary
 - https://github.com/lorenbrichter/Words - Spanish spellchecker
 - https://github.com/ManiacDC/TypingAid - Spanish spellchecker
 - https://freedict.org - English & German & Polish & Spanish winning words dictionary

### Other
 - https://iconmonstr.com/ - icons
 - https://github.com/lipis/flag-icons - flags
