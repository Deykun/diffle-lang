### Version 3.0 (19.01.2024)
- Support for other languages (English added alongside Polish)

### Version 2.0 (08.01.2024)
- Detailed local user statistics for the game.

### Version 1.0 (30.07.2023)
- Playable react clone of: https://github.com/hedalu244/diffle

# Detailed change log

---

#### Version 3.7
- **New**: Spanish game language added

#### Version 3.6 (21.02.2024)
- **New**: Support for QWERTZ added

#### Version 3.5.1 (19.02.2024)
- **Fix**: German /de redirection fix (https://deykun.github.io/ykun.github.io/ykun.github.io/diffle-lang/de/de/de)

#### Version 3.5 (19.02.2024)
- **New**: German game language supported
- **New**: Better RWD for really small screens

#### Version 3.4.1 (19.02.2024)
- **Fix**: Reset of special characters filters after changing the language to one without them
- **Fix**: Improvements to the language statistics page

#### Version 3.4 (13.02.2024)
- **New**: Language statistics subpage added
- **Fix**: Icon in corner background animaiton fix 

#### Version 3.3 (09.02.2024)
- **New**: A larger dictionary of winning words is used in the Czech language

#### Version 3.2.3 (08.02.2024)
- **Fix**: Changing the language during game loading doesn't block the restore process

#### Version 3.2.2 (08.02.2024)
- **New**: The incorrectly typed letter shakes inside a keycap
- **New**: A github start counter was added to github link

#### Version 3.2.1 (08.02.2024)
- **Fix**: Missing vibration restored for language picker trigger

#### Version 3.2 (08.02.2024)
- **New**: Czech game language supported
- **New**: When a user enters the site without a language marker, the last language used is saved, and this language is set
- **New**: A flag in the header and language selection in the settings open a new dedicated modal with a language picker
- **New**: A new button linking to a Google Form for reporting bad translations has been added
- **Fix**: The space below the keyboard is set dynamically and calculated based on rows and size settings

#### Version 3.1.3 (30.01.2024)
- **Fix**: Icons in header restored for Safari
- **Fix**: A doubled details caret removed for Safari
- **New**: Better rwd for header
- **Fix**: Better rwd for statistic card url
- **Fix**: Missing tags for shared results without words restored

#### Version 3.1.2 (26.01.2024)
- **Fix**: Correct streak in a row number after winning
- **New**: Hints about streaks in rows are displayed in practice mode

#### Version 3.1.1 (21.01.2024)
- **Fix**: The green light turned on too early for the keyboard. Only one of the two 'A's was typed

#### Version 3.1 (21.01.2024)
- **New**: Keyboard notes when the user discovers how many times the letter occurs in the word and displays it

#### Version 3.0.6 (20.01.2024)
- **Fix**: Language change is blocked when processing new words or restoring state

#### Version 3.0.5 (20.01.2024)
- **Fix**: Better detection of language for Chrome
- **New**: Typing incorrect letter has stronger vibration

#### Version 3.0.4 (20.01.2024)
- **Fix**: Simplifying the game process restoration (changing the game language in settings always resets the game mode to daily)
- **Fix**: Polish characters can be typed only in Polish mode

#### Version 3.0.3 (20.01.2024)
- **Fix**: Help isn't shown after redirecting if the user has already seen it
- **Fix**: Changing language removes shared result

#### Version 3.0.2 (20.01.2024)
- **New**: #difflepl instead of #diffle_pl

#### Version 3.0.1 (19.01.2024)
- **Fix**: Path to flag image fixed
- **Fix**: Setting /en for the english browser

#### Version 3.0 (19.01.2024)
- **New**: English game language supported
- **New**: Information about longest game in letters and words added to statistics
- **Fix**: A downloaded statistic card has proper paddings
- **Fix**: Statistics for people who gathered them before rejected words median data was introduced

#### Version 2.7.1 (17.01.2024)
- **Fix**: Mobile responsive web design restored

#### Version 2.7 (16.01.2024)
- **New**: Preparing landing pages for languages
- **Fix**: Cleaning dictionary before updating added, "oger" removed as Polish supported word in spellchecker
- **New**: Chunk ch3 added, removed chunks with single words (e.g., chunk-kee.json or chunk-mee.json)

#### Version 2.6 (16.01.2024)
- **Fix**: Word starting with "nie" doesn't destroy a game

#### Version 2.5.4 (16.01.2024)
- **New**: Shared links are now shorter, as words starting with the same letter are compressed more efficiently

#### Version 2.5.3 (15.01.2024)
- **New**: Fast deploy system
- **New**: Share button design

#### Version 2.5.2 (14.01.2024)
- **Fix**: Fixed wrong reading of CSS var with time in built release (.25s - was read as 25s)

#### Version 2.5.1 (14.01.2024)
- **Fix**: The next daily password now displays the same number in both settings and game view
- **Fix**: Improved hover state for share buttons in dark mode
- **Fix**: Confirm screen active state improved for toggle
- **Fix**: Scroll is now visible always, ensuring that the content doesn't move on desktop in Chrome

#### Version 2.5 (13.01.2024)
- **New**: Remove statistics by game mode added
- **New**: Hint about statistics for daily users with nice streak (5, 10, 25, 50, 75, etc.)
- **Fix**: New practice game button margin fixed while loading
- **Fix**: Very long words in shared content do not generate scroll

#### Version 2.4.1 (13.01.2024)
- **Fix**: Fixed shared content for winning words that have Polish characters
- **Fix**: Unnecessary $ removed from "$1 h 37 m 20 s"

#### Version 2.4 (12.01.2024)
- **New**: Remove shared result button added

#### Version 2.3 (12.01.2024)
- **Fix**: First and last letter markers are more important than coupling

#### Version 2.2 (12.01.2024)
- **New**: Copying result with a link to words
- **Fix**: Better text for 0.0 not found words in dictionary
- **Fix**: An incorrectly typed letter is blurred below the confirmation screen, not above it
- **Fix**: "25 hours to the next daily word" adjusted

#### Version 2.1 (08.01.2024)
- **New**: Game will return soon screen added

#### Version 2.0 (08.01.2024)
- **New**: High contrast mode
- **New**: Statistics panel added
- **New**: Stat with percentage of keyboard discovered was added
- **New**: Single letters are considered green
- **New**: Arrows for up and down actions added
- **New**: Using the word second time is blocked
- **New**: Swap enter and backspace is possible
- **New**: Basic system to force update
- **Fix**: Typing 16 characters or longer word is blocked
- **Fix**: Restoring game with long words keeps them shrinked

#### Version 1.8.1 (30.11.2023)
- **New**: Caret works for mobile with click

#### Version 1.8 (30.11.2023)
- **New**: Clicking ← or → shows caret and allows easier modifications to the word
- **New**: Delete button is supported

#### Version 1.7.5 (11.11.2023)
- **Fix**: Safari `<br />` should be removed from copied content

#### Version 1.7.4 (30.09.2023)
- **Fix**: Error while fetching dictionary chunk does not block the chunk

#### Version 1.7.3 (31.08.2023)
- **New**: Turn off keyboard's vibrations
- **New**: Turn off submit confirm
- **New**: Make keyboard smaller
- **Fix**: Longer words are allowed while typing
- **New**: Less swear words in winning words pool

#### Version 1.7.2 (28.08.2023)
- Added a confirmation step to the keyboard
- The key "Enter" swapped with "Backspace" - again
- Keyboard slide-in animation added

#### Version 1.7.1 (28.08.2023)
- Special title for cheaters added

#### Version 1.7 (27.08.2023)
- Polish plurals fixed (2 słowa, 5 słów etc.)
- English partially added as a language supported by the interface

#### Version 1.6 (27.08.2023)
- Dark mode added
- Incorrect message about lost game fixed

#### Version 1.5 (26.08.2023)
- Vibration toggle added
- The key "Enter" swapped with "Backspace"

#### Version 1.4.2 (26.08.2023)
- Next game time for daily shown

#### Version 1.4.1 (26.08.2023)
- Better UX for settings

#### Version 1.4 (26.08.2023)
- Fixed broken progress save
- Added vibration while typing on the phone
- Implemented word checker for the entire keyboard

#### Version 1.3 (26.08.2023)
- Daily and practice modes work

#### Version 1.2 (02.08.2023)
- Progress is not lost when the page is reloaded
- The player can give up
- The Enter key is an icon

#### Version 1.1 (30.07.2023)
- The user is informed if the winnning word contains Polish characters
- Two-character words are accepted
- The saturation of unused letters was decreased
- The keys "Enter" and "Backspace" are visually marked

#### Version 1.0 (30.07.2023)
- Working game
- Help page
