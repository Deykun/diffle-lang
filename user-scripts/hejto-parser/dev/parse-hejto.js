window.diffle = {};

export const parseHejto = () => {
  const source = location.href.split('#')[0];
  const parsedResults = [];

  const links = Array.from(document.querySelectorAll('.parsed a[href*="diffle-lang"]'));

  const resultsByNick = links.reduce((stack, el) => {
    const commentBodyEl = el.closest('.flex.flex-col.bg-grey-250') || el.closest('.px-2.py-3.flex.flex-col');

    if (commentBodyEl) {
      const nickEl = commentBodyEl.querySelector('a[href*="/uzytkownik/"]');
      const nick = nickEl?.getAttribute('href')?.replace('/uzytkownik/', '')

      const url = el.href;
      const rHash = url.split('r=')[1];
      const value = rHash ? demaskValue(rHash) : '';

      let result;
      if (value) {
        const [wordWithOptionalDay, correct, position, incorrect, knownIncorrect, ...words] = value.replace('!(', '').replace(')!', '').split('.');
        
        const [word, dayOfYear] = wordWithOptionalDay.split('-');
        
        const totalWords = words.length;
        const totalLetters = Number(correct) + Number(position) + Number(incorrect);

        commentBodyEl.setAttribute('data-hp-badge', `${nick} ${word} (${totalLetters} in ${totalWords}): ${correct} 🟢 ${position} 🟡 ${incorrect} ⚪ ${knownIncorrect} 🔴`);
     
      } else {
        commentBodyEl.setAttribute('data-hp-badge', `${nick}`);
      }



      stack.push({
        nickEl,
        commentBodyEl,
        el,
        url,
        value,
      });
    }

    return stack;
  }, []);

  console.log(resultsByNick)
  
  if (window.diffle[source]) {
    window.diffle[source] = [...window.diffle[source], parsedResults];
  } else {
    window.diffle[source] = parsedResults;
  }

  saveSource(source, window.diffle[source]);
};
