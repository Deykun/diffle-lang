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

/* import @/constants.js */

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
    /* import @/db.js */
    /* import @/dom.js */
    /* import @/helpers.js */
    /* import @/icons.js */
    /* import @/interface.js */

    /* import @/parse-details.js */
    /* import @/parse-page.js */

    const parse = () => {
      if (location.href.includes('hejto.pl/wpis/')) {
        /* import @/parse-hejto.js */
        parseHejto();
      }
    };

    /* import @/render-app-copy.js */
    /* import @/render-app.js */

    parse();

    renderApp();

    /* import @/subscribers.js */

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
