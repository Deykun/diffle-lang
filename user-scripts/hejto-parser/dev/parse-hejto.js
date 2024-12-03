window.diffle = {};

export const parseHejto = () => {
  const source = location.href.split('#')[0].replace('?close=1', '');
  const links = Array.from(document.querySelectorAll('.parsed a[href*="diffle-lang"]'));

  const resultsByNick = links.reduce((stack, el) => {
    const commentBodyEl = el.closest('.flex.flex-col.bg-grey-250') || el.closest('.px-2.py-3.flex.flex-col');

    if (commentBodyEl) {
      const nickEl = commentBodyEl.querySelector('a[href*="/uzytkownik/"]');
      const nick = nickEl?.getAttribute('href')?.replace('/uzytkownik/', '');

      const date = commentBodyEl.innerText?.match(/[0-3][0-9].[0-9][0-9].202[3|4]/)?.[0];

      const url = el.href;

      let lang = '';

      if (url.includes('/pl')) {
        lang = 'pl';
      } else if (url.includes('/en')) {
        lang = 'en';
      } else if (url.includes('/it')) {
        lang = 'it';
      } else if (url.includes('/de')) {
        lang = 'de';
      } else if (url.includes('/fr')) {
        lang = 'fr';
      }

      const rHash = url.split('r=')[1];
      const value = rHash ? demaskValue(rHash) : '';

      let result;
      if (value) {
        const [wordWithOptionalDay, correct, position, incorrect, knownIncorrect, ...words] = value.replace('!(', '').replace(')!', '').split('.');
        
        const [word, dayOfYear] = wordWithOptionalDay.split('-');
        
        const totalWords = words.length;
        const totalLetters = Number(correct) + Number(position) + Number(incorrect);

        commentBodyEl.setAttribute('data-hp-badge', `${nick} ${word} (${totalLetters} in ${totalWords}): ${correct} 🟢 ${position} 🟡 ${incorrect} ⚪ ${knownIncorrect} 🔴`);
     
        result = {
          word,
          correct: Number(correct),
          position: Number(position),
          incorrect: Number(incorrect),
          knownIncorrect: Number(knownIncorrect),
          totalWords,
          totalLetters,
          date,
        }
      } else {
        commentBodyEl.setAttribute('data-hp-badge', `${nick}`);
      }

      if (nick) {
        stack[nick] = {
          date,
          nick,
          lang,
          url,
          value,
          result,
        };
      }
    }

    return stack;
  }, {});
  
  const parsedResults = Object.values(resultsByNick);
  
  if (window.diffle[source]) {
    window.diffle[source] = [...window.diffle[source], parsedResults];
  } else {
    window.diffle[source] = parsedResults;
  }

  saveSource(source, window.diffle[source]);

  if (location.href.includes('close=1')) {
    window.close();
  }
};
