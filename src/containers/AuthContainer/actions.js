// @flow

import * as constants from './constants';

export function onLogout(): Promise<any> {
  // $FlowFixMe Middleware transforms this into a promise
  return {
    type: constants.API_LOGOUT,
    meta: {
      onSuccess: {
        transition: () => ({
          pathname: '/auth',
        }),
      },
    },
  };
}

export function getUser(): Promise<any> {
  // $FlowFixMe Middleware transforms this into a promise
  return {
    type: constants.API_GET_USER,
    meta: {
      onFailure: {
        notify: false,
      },
    },
  };
}
