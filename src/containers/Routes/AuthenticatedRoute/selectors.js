// @flow

import { createSelector } from 'reselect';
import type { Map } from 'immutable';

import { NAMESPACE as AUTH } from 'containers/AuthContainer/constants';

const selectAuthentication = () => createSelector(
  (state: Map<string, any>) => state.get(AUTH),
  (substate) => ({
    auth: {
      isLoading: substate.get('isLoading'),
      isAuthenticated: (substate.get('user') !== null),
      user: substate.get('user'),
    },
  })
);

export default selectAuthentication;
