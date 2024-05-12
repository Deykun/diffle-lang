export const DICTIONARIES_BY_LANG: {
  [key: string]: {
    isSpeelchecker?: true,
    href: string,
    labelHTML: string,
  }[],
} = {
  cs: [{
    isSpeelchecker: true,
    href: 'https://gitlab.com/strepon/czech-cc0-dictionaries/',
    labelHTML: '<strong>Czech CC0 dictionaries</strong>',
  }, {
    href: 'http://home.zcu.cz/~konopik/ppc/',
    labelHTML: '<strong>slovniky.webz.cz</strong> z <strong>home.zcu.cz</strong>',
  }],
  de: [{
    isSpeelchecker: true,
    href: 'http://www.aaabbb.de/WordList/WordList.php',
    labelHTML: '<strong>wikipedia.org</strong> via <strong>aaabbb.de</strong>',
  }, {
    href: 'https://freedict.org/',
    labelHTML: '<strong>freedict.org</strong>',
  }],
  en: [{
    isSpeelchecker: true,
    href: 'https://github.com/dwyl',
    labelHTML: 'github.com/<strong>dwyl</strong>',
  }, {
    href: 'https://freedict.org/',
    labelHTML: '<strong>freedict.org</strong>',
  }],
  es: [{
    isSpeelchecker: true,
    href: 'https://github.com/lorenbrichter/Word',
    labelHTML: '<strong>Letterpress</strong>',
  }, {
    isSpeelchecker: true,
    href: 'https://github.com/ManiacDC/TypingAid/',
    labelHTML: 'github.com/<strong>ManiacDC</strong>/<strong>TypingAid</strong>',
  }, {
    href: 'https://freedict.org/',
    labelHTML: '<strong>freedict.org</strong>',
  }],
  fr: [{
    isSpeelchecker: true,
    href: 'https://grammalecte.net',
    labelHTML: '<strong>Grammalecte</strong>',
  }, {
    href: 'https://freedict.org/',
    labelHTML: '<strong>freedict.org</strong>',
  }, {
    href: 'http://www.lexique.org/',
    labelHTML: '<strong>Lexique.org</strong>',
  }],
  it: [{
    isSpeelchecker: true,
    href: 'https://www.libreitalia.org',
    labelHTML: '<strong>LibreItalia.org</strong>',
  }, {
    isSpeelchecker: true,
    href: 'https://github.com/hermitdave/FrequencyWords',
    labelHTML: 'hermitdave <strong>FrequencyWords</strong>',
  }, {
    href: 'https://freedict.org/',
    labelHTML: '<strong>freedict.org</strong>',
  }],
  pl: [{
    isSpeelchecker: true,
    href: 'https://sjp.pl',
    labelHTML: '<strong>sjp.pl</strong>',
  }, {
    href: 'https://freedict.org/',
    labelHTML: '<strong>freedict.org</strong>',
  }],
};
