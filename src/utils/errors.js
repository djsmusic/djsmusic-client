// @flow

import type { RequestParams } from 'utils/constants';

/**
 * Error class for an error raised trying to make an API call
 *
 * @class RequestError
 * @access public
 * @param {string} message - the error message
 */
export class RequestError extends Error {
  name: string;
  message: string;
  requestParams: RequestParams;

  constructor(message: string, requestParams: RequestParams) {
    super(message);
    this.name = 'RequestError';
    this.message = message;
    this.requestParams = requestParams;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }

  toString = () => {
    let requestInfo = '';
    if (this.requestParams) {
      requestInfo = `(${this.requestParams.method} ${this.requestParams.url})`;
    }
    return `RequestError: ${this.message} ${requestInfo}`;
  };
}

/**
 * Error class for an API response outside the 200 range
 *
 * @class ApiError
 * @access public
 * @param {number} status - the status code of the API response
 * @param {string} statusText - the status text of the API response
 * @param {object} response - the parsed JSON response of the API server if the
 *  'Content-Type' header signals a JSON response
 */
export class ApiError extends Error {
  status: number;
  response: any;
  json: any;
  requestParams: RequestParams;

  constructor(status: number, message: string, requestParams: RequestParams, response: any, json?: any) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.response = response;
    this.message = message;
    this.json = json;
    this.requestParams = requestParams;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }

  toString = () => {
    let requestInfo = '';
    if (this.requestParams) {
      requestInfo = `(${this.requestParams.method || ''} ${this.requestParams.url || ''})`;
    }
    return `ApiError: ${this.message} ${requestInfo}`;
  };
}
