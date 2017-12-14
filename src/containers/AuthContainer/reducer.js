// @flow

import { handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';

import { success, pending, failure } from 'utils/actionsUtil';

import * as constants from './constants';

export const initialState = Map({
  isLoading: true,
  user: null,
});

export default handleActions({
  [pending(constants.API_GET_USER)]: loadingUser,
  [success(constants.API_GET_USER)]: updateUser,
  [failure(constants.API_GET_USER)]: failedGetUser,
  [success(constants.API_LOGOUT)]: logout,
}, initialState);

function loadingUser(state) {
  return state.merge({
    isLoading: true,
  });
}

function updateUser(state, action) {
  return state.merge({
    isLoading: false,
    user: fromJS(action.payload),
  });
}

function failedGetUser(state) {
  return state.merge({
    isLoading: false,
  });
}

function logout() {
  return initialState;
}
