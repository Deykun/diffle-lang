import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';

import { Provider } from "react-redux";

import store from './store';
import i18n from './i18n';

import App from './App';
import './index.scss'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
      </Provider>
  </React.StrictMode>,
)
