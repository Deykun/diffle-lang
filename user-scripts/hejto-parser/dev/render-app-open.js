export const getAppOpen = () => {
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
