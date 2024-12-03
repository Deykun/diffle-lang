const getFromLocalStorage = (key, defaultValues = {}) => (localStorage.getItem(key)
  ? { ...defaultValues, ...JSON.parse(localStorage.getItem(key)) }
  : { ...defaultValues });

const getSourcesFromLS = () => getFromLocalStorage('wikiparse-units', {});

const getSettingsFromLS = () => getFromLocalStorage('wikiparse-state', {});

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
