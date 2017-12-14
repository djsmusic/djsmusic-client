// @flow

import PropTypes from 'prop-types';
import createRouterProxy from 'react-cosmos-router-proxy';
import createContextProxy from 'react-cosmos-context-proxy';
import createReduxProxy from 'react-cosmos-redux-proxy';

import configureStore from '../../app/store';

const ReduxProxy = createReduxProxy({
  createStore: state => configureStore(state)
});

const ContextProxy = createContextProxy({
  childContextTypes: {
    intl: PropTypes.object,
    dragDropManager: PropTypes.object,
  }
});

export default [
  createRouterProxy(),
  ReduxProxy,
  ContextProxy
];
