// @flow

/**
 * DJs Music Web Client
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

// Import root app
import App from 'sections/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon, the manifest.json file and the .htaccess file
// /* eslint-disable import/no-webpack-loader-syntax */
// // $FlowFixMe file-loader madness!
// import '!file-loader?name=[name].[ext]!./favicon.ico';
// // $FlowFixMe file-loader madness!
// import '!file-loader?name=[name].[ext]!./manifest.json';
// /* eslint-enable import/no-webpack-loader-syntax */

import configureStore from './store';

// Import i18n messages
import { translationMessages } from './i18n';

// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE: null | HTMLElement = document.getElementById('root');

// Ugliest hack in the world of hacks...
// This is here so that sagasUtil can resend actions
// to retry failed API calls
// Todo Find a way without doing this
window.dispatch = store.dispatch;

const render = (translatedMessages) => {
  ReactDOM.render(
    <Provider store={ store }>
      <LanguageProvider messages={ translatedMessages }>
        <Router history={ history }>
          <App />
        </Router>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE
  );
};

// Hot reloadable React components and translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  // $FlowFixMe module.hot is of type unknown
  module.hot.accept(['./i18n', 'sections/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(import('intl'));
  }))
    .then(() => Promise.all([
      import('./translations/es.json'),
    ]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
