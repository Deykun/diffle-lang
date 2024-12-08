// ==UserScript==
// @name            Wikipedia Parser
// @description     It parses information about coats of arms from Wikipedia using visual markers.
// @namespace       deykun
// @author          deykun
// @version         SCRIPT_VERSION
// @include         https://*hejto.pl*
// @grant           none
// @run-at          document-start
// ==/UserScript==

'use strict';

const getFromLocalStorage = (key, defaultValues = {}) => (localStorage.getItem(key)
  ? { ...defaultValues, ...JSON.parse(localStorage.getItem(key)) }
  : { ...defaultValues });

const getSourcesFromLS = () => getFromLocalStorage('hejtoparse-units', {});

const getSettingsFromLS = () => getFromLocalStorage('hejtoparse-state', {});

window.HejtoParser = {
  version: 'SCRIPT_VERSION',
  isDevMode: false,
  cache: {
    HTML: {},
    CSS: {},
    inited: false,
    status: null,
    location: location.href,
  },
  settings: getSettingsFromLS(),
  actions: {},
};

window.HejtoParser.ui = {
  status: {
    type: '',
    text: '',
  },
  openedContent: '',
  eventsSubscribers: {},
};


const userScriptLogger = (params) => {
  if (params.isError) {
    const { isCritical = false, message = '', error } = params;

    if (isCritical) {
      // eslint-disable-next-line no-console
      console.error('A WikipediaParser error (from Tampermonkey) has occurred.');
      // eslint-disable-next-line no-console
      console.error(`WikipediaParser error: ${message}`);
      // eslint-disable-next-line no-console
      console.error(error);
    }

    if (window.HejtoParser.isDevMode && error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
};

const domReady = (fn) => {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    fn();

    return;
  }

  document.addEventListener('DOMContentLoaded', fn);
};

const initHejtoParser = async () => {
  // TODO: check if needed
  // if (window.HejtoParser.cache.inited) {
  //   return;
  // }

  // window.HejtoParser.cache.inited = true;

  try {
    const saveSource = (source, value) => {
  const unitsBySource = getSourcesFromLS();

  unitsBySource[source] = value;

  localStorage.setItem('hejtoparse-units', JSON.stringify(unitsBySource));
};

const getDetailsKey = (url) => url.split(location.host).at(-1).replace('&autoclose=1', '');

const saveDetails = (url, value) => {
  const key = getDetailsKey(url);


  localStorage.setItem(`details_${key}`, value);
}

const getDetails = (url) => {
  const key = getDetailsKey(url);

  return localStorage.getItem(`details_${key}`) || '';
}
    const appendCSS = (styles, { sourceName = '' } = {}) => {
  const appendOnceSelector = sourceName ? `g-hp-css-${sourceName}`.trim() : undefined;
  if (appendOnceSelector) {
    /* Already appended */
    if (document.getElementById(appendOnceSelector)) {
      return;
    }
  }

  const style = document.createElement('style');
  if (sourceName) {
    style.setAttribute('id', appendOnceSelector);
  }

  style.innerHTML = styles;
  document.head.append(style);
};

// eslint-disable-next-line default-param-last
const render = (HTML = '', source) => {
  const id = `g-hp-html-${source}`;

  if (HTML === window.HejtoParser.cache.HTML[id]) {
    /* Don't rerender if HTML is the same */
    return;
  }

  window.HejtoParser.cache.HTML[id] = HTML;

  const wrapperEl = document.getElementById(id);

  if (!HTML) {
    if (wrapperEl) {
      wrapperEl.remove();
    }

    return;
  }

  if (wrapperEl) {
    wrapperEl.innerHTML = HTML;

    return;
  }

  const el = document.createElement('div');
  el.id = id;
  el.setAttribute('data-testid', id);
  el.innerHTML = HTML;

  document.body.appendChild(el);
};

const nestedSelectors = (selectors, subcontents) => {
  return subcontents.map(([subselector, content]) => {
    return `${selectors.map((selector) => `${selector} ${subselector}`).join(', ')} {
      ${content}
    }`;
  }).join(' ');
};

    const debounce = (fn, time) => {
  let timeoutHandler;

  return (...args) => {
    clearTimeout(timeoutHandler);
    timeoutHandler = setTimeout(() => {
      fn(...args);
    }, time);
  };
};

const getMD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

const upperCaseFirstLetter = (text) => (typeof text === 'string' ? text.charAt(0).toUpperCase() + text.slice(1) : '');

const copyText = (text) => {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = text;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
};

const openInNewTab = (url) => {
  Object.assign(document.createElement('a'), {
      target: '_blank',
      rel: 'noreferrer noopener',
      href: url,
  }).click();
}

const getSafeText = (text) => {
  if (!text) {
    return '';
  }

  return text.replace(/\n|\r/g, ' ').replaceAll(`'`, `"`).replaceAll(`'`, '"').replace(/\s\s+/g, ' ');
}

const demaskValue = (base64ReversedNoEqual) => {
  try {
    const base64Reversed = decodeURIComponent(base64ReversedNoEqual);
    const base64Value = Array.from(base64Reversed).reverse().join('');

    // const value = Buffer.from(base64Value, 'base64').toString('ascii');
    const encodedValue = atob(base64Value);

    const value = decodeURIComponent(encodedValue);

    return value;
  } catch (error) {
    return '';
  }
};
    /*
  https://iconmonstr.com
*/

const IconCopy = `<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" clip-rule="evenodd" viewBox="0 0 25 25">
<path fill-rule="nonzero" d="M6 19v2c0 .621.52 1 1 1h2v-1.5H7.5V19zm7.5 3H10v-1.5h3.5zm4.5 0h-3.5v-1.5H18zm4-3h-1.5v1.5H19V22h2c.478 0 1-.379 1-1zm-1.5-1v-3.363H22V18zm0-4.363V10H22v3.637zM7.5 10v3.637H6V10zM19 6v1.5h1.5V9H22V7c0-.478-.379-1-1-1zM9 6H7c-.62 0-1 .519-1 1v2h1.5V7.5H9zm4.5 1.5H10V6h3.5zm3-1.5V3.5h-13v13H6v-1.863h1.5V18H3c-.48 0-1-.379-1-1V3c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v4.5h-3.5V6z"/>
</svg>`;

const IconCopyAlt = `<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" clip-rule="evenodd" viewBox="0 0 25 25">
<path fill-rule="nonzero" d="M6 18H3c-.48 0-1-.379-1-1V3c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v3h3c.621 0 1 .522 1 1v14c0 .621-.522 1-1 1H7c-.48 0-1-.379-1-1zM7.5 7.5v13h13v-13zm9-1.5V3.5h-13v13H6V7c0-.481.38-1 1-1z"/>
</svg>`;

const IconRemove = `<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 25 25">
<path d="M5.662 23 .293 17.635C.098 17.44 0 17.185 0 16.928c0-.256.098-.512.293-.707L15.222 1.293c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707L12.491 21h5.514v2H5.662zm3.657-2-5.486-5.486-1.419 1.414L6.49 21h2.829zm.456-11.429-4.528 4.528 5.658 5.659 4.527-4.53-5.657-5.657z"/>
</svg>`;

const IconOpen = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-8h-8V5zm13 2a2 2 0 0 0-2-2h-5v4h7z"/>
</svg>`;

    appendCSS(`
.hp-text-input-wrapper {
  display: flex;
  gap: 5px;
  position: relative;
}

.hp-text-input-wrapper input {
  width: 100%;
  padding-left: 10px;
}

.hp-text-input-wrapper label {
  position: absolute;
  top: 0;
  left: 5px;
  transform: translateY(-50%);
  background-color: var(--hp-nav-item-bg);
  padding: 2px 5px;
  border-radius: 2px;
  font-size: 9px;
}
`, { sourceName: 'interface-text-input' });

const getTextInput = ({
  idInput, idButton, label, name, value = '', placeholder, isDisabled = false,
}) => {
  return `<div class="hp-text-input-wrapper">
    <input
      ${idInput ? ` id="${idInput}" ` : ''}
      type="text"
      ${name ? ` name="${name}" ` : ''}
      value="${value}"
      placeholder="${placeholder}"
      ${isDisabled ? ' disabled ' : ''}
    />
    ${label ? `<label>${label}</label>` : ''}
    <button id="${idButton}" class="hp-nav-popup-button" title="Save">
      ${IconSave}
    </button>
  </div>`;
};

appendCSS(`
.hp-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 400;
}

.hp-checkbox-wrapper input {
  margin-left: 5px;
  margin-right: 5px;
}
`, { sourceName: 'interface-value' });

const getCheckbox = ({
  idInput, classNameInput, label, name, value, isChecked = false, type = 'checkbox',
}) => {
  return `<label class="hp-checkbox-wrapper">
    <span>
      <input
        type="${type}"
        ${idInput ? ` id="${idInput}" ` : ''}
        ${classNameInput ? ` class="${classNameInput}" ` : ''}
        name="${name}"
        ${value ? `value="${value}"` : ''}
        ${isChecked ? ' checked' : ''}
      />
    </span>
    <span>${label}</span>
  </label>`;
};

const getRadiobox = (params) => {
  return getCheckbox({ ...params, type: 'radio' });
};


    /* import @/parse-details.js */
    appendCSS(`
  [data-hp-badge],
  [data-hp-badge-sm] {
    position: relative;
  }

  [data-hp-badge]::after,
  [data-hp-badge-sm]::after {
    content: attr(data-hp-badge);
    position: absolute;
    top: 40px;
    right: 10px;
    background-color: #fff;
    font-size: 13px;
    padding: 0 3px;
    border-radius: 2px;
    color: #0c54a2 !important;
    transform-origin: top left;
    overflow: hidden;
    transition: all 0.15s ease-in-out;
  }

  [data-hp-badge-sm]::after {
    max-width: 14px;
    content: attr(data-hp-badge-sm);
    font-size: 10px;
    padding: 0 2px;
  }

  [data-hp-badge]:hover::after,
  [data-hp-badge-sm]:hover::after,
  [data-hp-badge-open]::after {
    max-width: 300px;
  }
`, { sourceName: 'parse-page' });


    const parse = () => {
      if (location.href.includes('hejto.pl/wpis/')) {
        window.diffle = {};

const parseHejto = () => {
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

      if (url.includes('/pl') || url.includes('/diffle-lang/?r=')) {
        lang = 'pl';
      } else if (url.includes('/en')) {
        lang = 'en';
      } else if (url.includes('/it')) {
        lang = 'it';
      } else if (url.includes('lang/de')) {
        lang = 'de';
      } else if (url.includes('/fr')) {
        lang = 'fr';
      } else if (url.includes('/es')) {
        lang = 'es';
      } else if (url.includes('/cs')) {
        lang = 'cs';
      }

      const rHash = url.split('r=')[1];
      const value = rHash ? demaskValue(rHash) : '';

      let result;
      if (value && lang) {
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

      if (nick && lang) {
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

        parseHejto();
      }
    };

    appendCSS(`
`, { sourceName: 'render-app-copy' });

const getAppCopy = () => {
  return `<div class="hp-nav-button-wrapper">
    <button id="copy-code" class="hp-nav-button" title="Copy this page">${IconCopy}</button>
    <button id="copy-code-all" class="hp-nav-button" title="Copy all">${IconCopyAlt}</button>
    <button id="remove-all" class="hp-nav-button" title="Clear">${IconRemove}</button>
  </div>`;
};

const getSourceTextToCopy = (source, value) => {
  return `
  results.resultsBySource['${source}'] = [
    ${(value || window.diffle[source]).map((item) => {
      return JSON.stringify(item);
    }).join(', ')}
  ]; 
`;
}

window.HejtoParser.ui.eventsSubscribers.copyCode = {
  selector: '#copy-code',
  handleClick: () => {
    const source = location.href.split('#')[0];

    if (window.diffle[source]) {
      console.log('Copied!');

      copyText(getSourceTextToCopy(source));
    }
  },
};

window.HejtoParser.ui.eventsSubscribers.copyCodeAll = {
  selector: '#copy-code-all',
  handleClick: () => {
    const unitsBySource = getSourcesFromLS();
    const indexedSources = Object.keys(unitsBySource).sort((a, b) => a.localeCompare(b));

    if (indexedSources.length > 0) {
      const textToCopy = indexedSources.map((source) => getSourceTextToCopy(source, unitsBySource[source])).join(' ');
      
      console.log('Copied!');
      copyText(textToCopy);
    }
  },
};

window.HejtoParser.ui.eventsSubscribers.removeAll = {
  selector: '#remove-all',
  handleClick: () => {
    localStorage.removeItem('hejtoparse-units');
    // localStorage.clear();
    console.log('Removed!');
  },
};

    const getAppOpen = () => {
  return `<div class="hp-nav-button-wrapper">
    <button id="open-all" class="hp-nav-button" title="Open all">${IconOpen}</button>
  </div>`;
};

window.HejtoParser.ui.eventsSubscribers.open = {
  selector: '#open-all',
  handleClick: () => {
    const links = Array.from(document.querySelectorAll('.flex.flex-col.gap-4 > .flex.flex-col.gap-4 > .bg-paper-light-primary > :first-child time'));

    links.forEach((el) => {
      const link = el.parentNode.getAttribute('href');
    
      if (link) {
        openInNewTab(`${link}?close=1`);
      }
    })
  },
};

    appendCSS(`
  :root {
    --hp-nav-item-size: 48px;
    --hp-nav-item-bg: #fff;
    --hp-nav-item-text-strong: #fff;
    --hp-nav-item-text: #59636e;
    --hp-nav-item-text-hover: 0969da;
    --hp-nav-item-border: #d1d0e0b3;
    --hp-nav-item-radius: 5px;
  }

  .hp-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    right: 30px;
    height: var(--hp-nav-item-size);
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.08));
  }

  .hp-nav > * + * {
    margin-left: -1px;
  }

  .hp-nav > :first-child {
    border-top-left-radius: var(--hp-nav-item-radius);
  }

  .hp-nav > :last-child {
    border-top-right-radius: var(--hp-nav-item-radius);
  }

  .hp-nav-status,
  .hp-nav-button-wrapper {
    height: var(--hp-nav-item-size);
    min-width: var(--hp-nav-item-size);
    line-height: var(--hp-nav-item-size);
    border: 1px solid var(--hp-nav-item-border);
    border-bottom-width: 0px;
    background: var(--hp-nav-item-bg);
  }

  .hp-nav-button-wrapper {
    position: relative;
  }

  .hp-nav-button {
    background: transparent;
    border: none;
    padding: 0;
    color: var(--hp-nav-item-text);
    width: var(--hp-nav-item-size);
    transition: 0.3s ease-in-out;
    box-sizing: border-box;
  }

  .hp-nav-button:hover {
    color: var(--hp-nav-item-text-hover);
  }

  .hp-nav-button--active {
    color: var(--hp-nav-item-text-strong);
  }

  .hp-nav-button svg {
    fill: currentColor;
    padding: 25%;
    height: var(--hp-nav-item-size);
    width: var(--hp-nav-item-size);
    line-height: var(--hp-nav-item-size);
    box-sizing: border-box;
  }

  .hp-nav-popup {
    position: absolute;
    right: 0;
    bottom: calc(100% + 10px);
    width: 300px;
    color: var(--hp-nav-item-text-strong);
    border: 1px solid var(--hp-nav-item-border);
    border-radius: var(--hp-nav-item-radius);
    border-bottom-right-radius: 0;
    background-color: var(--hp-nav-item-bg);
  }

  .hp-nav-popup-content {
    display: flex;
    flex-flow: column;
    gap: 18px;
    max-height: calc(100vh - 60px);
    overflow: auto;
    padding: 10px;
    padding-top: 0;
    font-size: 12px;
    line-height: 1.3;
    text-align: left;
  }

  .hp-nav-popup-title {
    position: sticky;
    top: 0px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 10px;
    padding-bottom: 5px;
    font-size: 16px;
    background-color: var(--hp-nav-item-bg);
  }

  .hp-nav-popup-title svg {
    fill: currentColor;
    height: 16px;
    width: 16px;
  }

  .hp-nav-popup h3 {
    font-size: 13px;
    margin-bottom: 8px;
  }

  .hp-nav-popup ul {
    display: flex;
    flex-flow: column;
    gap: 8px;
    list-style: none;
  }

  .hp-nav-popup .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .hp-nav-popup::after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: calc((var(--hp-nav-item-size) / 2) - 5px);
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top-color: var(--hp-nav-item-border);
  }

  .hp-nav-popup-button {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border-radius: 3px;
    font-size: 14px;
    letter-spacing: 0.04em;
    text-decoration: none;
    background: none;
    border: none;
    color: var(--bgColor-default);
    background-color: var(--fgColor-success);
  }

  .hp-nav-popup-button:hover {
    text-decoration: none;
  }

  .hp-nav-popup-button svg {
    fill: currentColor;
    width: 18px;
    height: 18px;
  }
`, { sourceName: 'render-app' });

const renderApp = () => {
  const content = window.HejtoParser.ui.openedContent;

  render(`<aside class="hp-nav" data-active="${content}">
    ${getAppCopy()}
    ${getAppOpen()}
  </aside>`, 'hp-app');
};

// window.HejtoParser.ui.eventsSubscribers.content = {
//   selector: '.hp-nav-button',
//   handleClick: (_, calledByElement) => {
//     if (calledByElement) {
//       const content = calledByElement.getAttribute('data-content');
//       const isClose = !content || content === window.wp.ui.openedContent;

//       if (isClose) {
//         window.wp.ui.openedContent = '';
//       } else {
//         window.wp.ui.openedContent = content;
//       }
//     }

//     renderApp();
//   },
// };



    parse();

    renderApp();

    try {
  document.body.addEventListener('click', (event) => {
    const handlerData = Object.values(window.HejtoParser.ui.eventsSubscribers).find(({ selector }) => {
      /* It checks max 4 nodes, while .closest() would look for all the nodes to body */
      const matchedHandlerData = [
        event.target,
        event.target?.parentElement,
        event.target?.parentElement?.parentElement,
        event.target?.parentElement?.parentElement?.parentElement,
      ].filter(Boolean).find((el) => el.matches(selector));

      return Boolean(matchedHandlerData);
    });

    if (handlerData) {
      const { selector, handleClick, shouldPreventDefault = true } = handlerData;

      if (shouldPreventDefault) {
        event.preventDefault();
      }

      const calledByElement = event.target.closest(selector);

      handleClick(event, calledByElement);
    }
  });
} catch (error) {
  userScriptLogger({
    isError: true, isCritical: true, message: 'Click detect failed', error,
  });
}


    const debouncedRefresh = debounce(() => {
      const didLocationChange = location.href !== window.HejtoParser.cache.location;
      if (didLocationChange) {
        window.HejtoParser.cache.location = location.href;

        renderApp();
      }

      if (location.href.includes('hejto.pl/wpis/')) {
        parse();
      }
    }, 500);

    const observer = new MutationObserver(debouncedRefresh);
    const config = {
      childList: true,
      subtree: true,
    };
    observer.observe(document.body, config);
  } catch (error) {
    userScriptLogger({
      isError: true, isCritical: true, message: 'initHejtoParser() failed', error,
    });

    throw error;
  }
};

domReady(initHejtoParser);
