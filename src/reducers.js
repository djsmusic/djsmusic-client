/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import reduceReducers from 'reduce-reducers';

import authContainerReducer from 'containers/AuthContainer/reducer';
import { reducer as notificationsReducer } from 'react-notification-system-redux';
import asyncLoggingReducer from 'utils/asyncLoggerReducer';
import errorHistoryReducer from 'containers/ErrorHistory/reducer';
import asmStackReducer from 'containers/StackContainer/combinedReducer';
import userSelectorReducer from 'containers/UserSelector/reducer';
import applicationListReducer from 'containers/ApplicationList/reducer';
import asmPageReducer from 'sections/AsmPage/reducer';
import asmReducer from 'utils/asmReducer';

// Load namespaces
import { NAMESPACE as ERROR_HISTORY } from 'containers/ErrorHistory/constants';
import { NAMESPACE as AUTH } from 'containers/AuthContainer/constants';
import { NAMESPACE as NOTIFICATIONS } from 'containers/Notifications/constants';
import { NAMESPACE as ASM_STACK } from 'containers/StackContainer/constants';
import { NAMESPACE as ASM_PAGE } from 'sections/AsmPage/constants';
import { NAMESPACE as USERS } from 'containers/UserSelector/constants';
import { NAMESPACE as APPLICATION_LIST } from 'containers/ApplicationList/constants';
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
    [NOTIFICATIONS]: notificationsReducer,
    [AUTH]: authContainerReducer,
    [ASYNC_NAMESPACE]: asyncLoggingReducer,
    [ERROR_HISTORY]: errorHistoryReducer,
    [ASM_PAGE]: asmPageReducer,
    [ASM_STACK]: reduceReducers(asmStackReducer, asmReducer),
    [USERS]: userSelectorReducer,
    [APPLICATION_LIST]: applicationListReducer,
    ...injectedReducers,
  });
}
