// @flow

import defer from 'deferred';

import { API_CALL } from 'sections/App/constants';
import type { Action } from 'definitions/action';

import api from '../api';

/**
 * Saga Middleware - Converts our high level API actions into actions that
 * will be handled by the saga utils.
 *
 * Actions must be in the following format:
 *
 * {
 *   type: 'API_{METHOD}_{ENDPOINT_NAME}',
 *   payload: {
 *     {data to be sent}
 *   },
 *   meta: {
 *     params: {}, // object of URL parameters
 *   }
 * }
 */
export default function sagaApiMiddleware() {
  return () => (next: Function) => (action: Action) => {
    const prefix = 'API-';
    if (action.type.substr(0, prefix.length) !== prefix) {
      // Not an API action
      return next(action);
    }

    const parts = action.type.split('-');
    const method = parts[1];
    const endpointName = parts[2];
    const asyncState = parts[3];
    const deferred = defer();

    // Ignore async notification actions
    if (asyncState) {
      return next(action);
    }

    if (!api[endpointName]) {
      throw new Error(`Undefined endpoint '${endpointName}' in saga`);
    }

    next({
      type: API_CALL,
      payload: action,
      meta: {
        method,
        endpoint: api[endpointName],
        params: (action.meta) ? action.meta.params : {},
        deferred,
      },
    });

    return deferred.promise;
  };
}

/**
 * Generate a valid API saga action
 * The endpoint should come from the api file
 * @param method
 * @param endpoint
 * @returns {string}
 */
export function apiAction(method: string, endpoint: string) {
  return `API-${method}-${endpoint}`;
}
