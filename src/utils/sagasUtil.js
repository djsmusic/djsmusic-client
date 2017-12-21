// @flow

import 'whatwg-fetch';
import React from 'react';
import { call, put } from 'redux-saga/effects';
import uuid from 'uuid';
import { List } from 'semantic-ui-react';

import { pending, success, failure } from 'utils/actionsUtil';
import { RequestError, ApiError } from 'utils/errors';
import type { Action } from 'definitions/action';

import { CSRF_HEADER } from './constants';
import type { RequestParams } from './constants';

let CSRF_TOKEN = null;

/**
 * Execute a request and dispatch specific actions automatically.
 *
 * The lifecycle of any async action will be as follows:
 *
 * 1. Receive original ACTION
 * 2. Dispatch ACTION_PENDING
 * 3. Send async request
 * 4. Dispatch ACTION_SUCCESS | ACTION_FAILURE depending on response
 *
 * Options and contents of each action:
 *
 * Input original ACTION {
 *   type: identifies this action
 *   payload: (Optional) will be sent as the body of the request
 *   meta: {
 *     uuid: Unique identifier for this action (will be random if unset)
 *     onSuccess: {
 *       transition: {Object} transition object (See johanneslumpe/redux-history-transitions for docs)
 *       notify: {false|string} String to be used as notification on success
 *       log: {boolean} Whether the action should be kept in the async store after it succeeds
 *     }
 *     onFailure: {
 *       transition: {Object} transition object (See johanneslumpe/redux-history-transitions for docs)
 *       notify: {false|string} String to be used as notification on success
 *       log: {boolean} Whether the action should be kept in the async store after it fails
 *     }
 *   }
 * }
 *
 * ACTION_PENDING {
 *   type: same as original + _PENDING
 *   payload: {
 *     action: original action (to enable replaying)
 *   }
 *   meta: {
 *     uuid: unique identifier for the original action
 *   }
 * }
 * ACTION_SUCCESS|ACTION_FAILURE {
 *   type: same as original + _SUCCESS|_FAILURE
 *   payload: {
 *     response|error object
 *   }
 *   meta: {
 *     uuid: unique identifier for the original action
 *     type: type of the original action
 *     transition: (Optional) the relevant onSuccess|onError transition specified in the original action
 *   }
 *   // on FAILURE:
 *   error: true
 * }
 *
 * ACTION_FAILURE will be dispatched both for non 20x responses, and for request errors (timeouts, server unreachable... )
 * The difference will be in the error payload, which will be an instance of ApiError for non 20x response codes, and an
 * instance of RequestError otherwise.
 *
 * @param {string}  method    Request method
 * @param {string}  url       Request URL
 * @param {Object}  action    Action that triggered this saga (used to generate the success and failure actions)
 */
export function* requestWithDispatcher(method: string, url: string, action: Action, deferred: ?any): any {
  let actionId = '';
  if (action.meta && action.meta.uuid) {
    actionId = action.meta.uuid;
  } else {
    actionId = uuid.v4();
  }

  yield put({
    type: pending(action.type),
    payload: { action },
    meta: {
      uuid: actionId,
    },
  });

  const requestParams: RequestParams = {
    method,
    url,
    payload: action.payload,
  };

  const { response, error } = yield call(request, requestParams);

  yield processResponse(action, actionId, response, error, requestParams, deferred);
}

/**
 * Process an API response
 * @param action Original action that triggered the call
 * @param actionId Original action's ID
 * @param response API response
 * @param error API error
 */
export function* processResponse(action: Action, actionId: string, response: any, error: any, requestParams: RequestParams, deferred: ?any): any {
  if (response) {
    const onSuccessAction: Action = {
      type: success(action.type),
      payload: response,
      meta: {
        type: action.type,
        uuid: actionId,
        transition: null,
        log: false,
      },
    };

    if (action.meta && action.meta.onSuccess) {
      onSuccessAction.meta.transition = action.meta.onSuccess.transition;
      onSuccessAction.meta.log = action.meta.onSuccess.log;

      if (action.meta.onSuccess.notify) {
        // yield put(
        //   Notifications.success({
        //     message: action.meta.onSuccess.notify,
        //   })
        // );
      }
    }

    if (deferred && deferred.resolve) {
      deferred.resolve(response);
    }

    yield put(onSuccessAction);
  } else {
    let returnError = error;
    if (!returnError.response) {
      returnError = new RequestError(error.message, requestParams);

      // yield put(Notifications.warning({
      //   title: 'Offline!',
      //   message: 'Server not reachable.',
      //   autoDismiss: false,
      //   action: {
      //     label: 'Retry',
      //     callback: () => {
      //       window.dispatch(action);
      //     },
      //   },
      // }));
    }

    const onErrorAction: Action = {
      type: failure(action.type),
      payload: returnError,
      meta: {
        type: action.type,
        uuid: actionId,
        transition: null,
        log: false,
      },
      error: true,
    };

    if (typeof action.meta !== 'undefined' && typeof action.meta.onFailure !== 'undefined') {
      // An onFailure action has been defined
      onErrorAction.meta.transition = action.meta.onFailure.transition;
      onErrorAction.meta.log = action.meta.onFailure.log;

      if (action.meta.onFailure.notify) {
        // notify was set to true, prepare notification message
        const message = (typeof action.meta.onFailure.notify === 'string') ? action.meta.onFailure.notify : error.message;
        let children = null;
        if (error.json && error.json.details && error.json.details.length > 0) {
          children = (
            <List divided>
              { error.json.details.map(detail => (
                <List.Item>{ detail }</List.Item>
              )) }
            </List>
          );
        }
        // yield put(
        //   Notifications.error({
        //     message,
        //     children,
        //     autoDismiss: false,
        //   })
        // );
      }
    } else {
      // Nothing was specified to be done onFailure, so notify by default
      let children = null;
      if (error.json && error.json.details && error.json.details.length > 0) {
        children = (
          <List divided>
            { error.json.details.map(detail => (
              <List.Item>{ detail }</List.Item>
            )) }
          </List>
        );
      }
      // yield put(Notifications.error({
      //   message: error.message,
      //   children,
      //   autoDismiss: false,
      // }));
    }

    // Overwrite redirect to /login if it's a 401 and we're not trying to login
    if (error.response && error.response.status === 401 && action.type !== 'API-POST-AUTH_LOGIN') {
      onErrorAction.meta.transition = () => ({
        pathname: '/auth',
      });
    }

    if (deferred && deferred.reject) {
      deferred.reject(returnError);
    }

    // Finally, send the failure action
    yield put(onErrorAction);
  }
}

/**
 * Execute a request with preset options
 * @param {string} method   Request method
 * @param {string} url      Request URL
 * @param {Object} payload  Request payload
 * @returns {Promise}
 */
export function request(requestParams: RequestParams): Promise<any> {
  return requestWithOptions(requestParams.url, {
    method: requestParams.method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestParams.payload),
    credentials: 'include',
  });
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url        The URL we want to request
 * @param  {object} [options]  The options we want to pass to "fetch"
 * @return {Promise}           The response data
 */
export function requestWithOptions(url: string, presetOptions: any): Promise<any> {
  const options = presetOptions || {};

  if (!options.headers) {
    options.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      [CSRF_HEADER]: '',
    };
  }

  if (CSRF_TOKEN) {
    options.headers[CSRF_HEADER] = CSRF_TOKEN;
  }

  return fetch(url, options)
    .then(getCSRFToken)
    .then(checkStatus)
    .then(parseJSON)
    .then(response => ({ response }))
    .catch(error => ({ error }));
}

/**
 * Extracts the CSRF token from the response, if available.
 * @param response
 */
function getCSRFToken(response: Response): Response {
  if (response.headers.get(CSRF_HEADER)) {
    CSRF_TOKEN = response.headers.get(CSRF_HEADER);
  }

  return response;
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response: Response): Promise<any> | Object {
  try {
    if (response.status === 204) {
      return response;
    }
    return response.json();
  } catch (e) {
    return response;
  }
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 */
function checkStatus(response: Response): Promise<Response> {
  if (response.ok) {
    return Promise.resolve(response);
  }
  return response.json().then(json => {
    const error = new ApiError(
      response.status,
      json.message || response.statusText,
      response,
      json
    );
    return Promise.reject(error);
  });
}
