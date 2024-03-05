React, Vite, TypeScript, Redux Toolkit, Playwright

# 🕹️ DIFFLE-LANG - word game

A Wordle-like game without a character limit, where every used word gives hints about the position and order of letters in the solution.

The website: https://deykun.github.io/diffle-lang/

Supported languages:
|       	|     🇨🇿     	|      🇬🇧     	|     🇫🇷     	|     🇵🇱     	|      🇪🇸     	|     🇩🇪     	|
|:-----:	|:----------:	|:-----------:	|:----------:	|:----------:	|:-----------:	|:----------:	|
|       	|  **Czech** 	| **English** 	| **French** 	| **Polish** 	| **Spanish** 	| **German** 	|
| Since 	| 02.02.2024 	|  19.01.2024 	| 03.03.2024 	| 30.07.2023 	|  21.02.2024 	| 19.02.2024 	|

<!---
   https://www.tablesgenerator.com/markdown_tables
-->

### Report a translation bug
https://crowdin.com/project/diffle-lang

[![Crowdin](https://badges.crowdin.net/diffle-lang/localized.svg)](https://crowdin.com/project/diffle-lang)

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
- https://deykun.github.io/diffle-lang/fr?p=about-language 🇫🇷
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
<<<<<<< HEAD
[Check DICTIONARIES.md](DICTIONARIES.md)
=======
[Check DICTIONARIES](DICTIONARIES.md)
>>>>>>> d36a35ceae0e1a2402032e8e0bf5756e79f2fb67

### Other
 - https://iconmonstr.com/ - icons
 - https://github.com/lipis/flag-icons - flags
