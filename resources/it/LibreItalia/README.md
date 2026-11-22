# Resources

Special thanks to LibreItalia: https://www.libreitalia.org/

https://git.libreoffice.org/dictionaries/+/refs/heads/master/it_IT

# How to download a .dic file?

1. Go to https://git.libreoffice.org/dictionaries
2. Use `git clone https://git.libreoffice.org/dictionaries

# How to generate dictionary.txt?

`core/it_IT.dic` has stems with affix flags (`abaco/OTqr`), `core/it_IT.aff` has the affix rules.

`npx tsx resources/it/LibreItalia/scripts/createDictionaryTXT.ts` expands them into `dictionary.txt` (one word form per line).

`getDictionaryWordsFromHunspell` (same directory) returns those words without saving the file.
