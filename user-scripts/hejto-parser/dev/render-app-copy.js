appendCSS(`
`, { sourceName: 'render-app-copy' });

export const getAppCopy = () => {
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
      const description = item.detailsUrl ? [item.description, getDetails(item.detailsUrl)].filter(Boolean).join(' |||| ') : item.description;

      if (item.detailsUrl) {
        console.log(item.detailsUrl);
        console.log(getDetails(item.detailsUrl));
      }

      const descriptionToCopy = (description || '').substring(0, 3000);

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
