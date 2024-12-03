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

export const renderApp = () => {
  const content = window.HejtoParser.ui.openedContent;

  render(`<aside class="hp-nav" data-active="${content}">
    ${getAppCopy()}
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

