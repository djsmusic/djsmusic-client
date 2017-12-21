/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { loadingBarReducer } from 'react-redux-loading-bar';

import authContainerReducer from 'containers/AuthContainer/reducer';
import asyncLoggingReducer from 'utils/asyncLoggerReducer';

// Load namespaces
import { NAMESPACE as AUTH } from 'containers/AuthContainer/constants';
import { ASYNC_NAMESPACE } from 'utils/constants';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  location: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        location: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    route: routeReducer,
    loadingBar: loadingBarReducer,
    [AUTH]: authContainerReducer,
    [ASYNC_NAMESPACE]: asyncLoggingReducer,
    ...injectedReducers,
  });
}
