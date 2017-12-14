/* eslint-disable redux-saga/yield-effects */

import { call } from 'redux-saga/effects';
import * as sagasUtil from 'utils/sagasUtil';
import { API_CALL } from 'sections/App/constants';

import * as sagas from '../sagas';

describe('App sagas', () => {
  const ACTION = {
    type: API_CALL,
    payload: 'testPayload',
    meta: {
      endpoint: '/test/endpoint',
      method: 'GET',
      params: {},
    },
  };
  it('calls the request function with the right params', () => {
    const generator = sagas.apiSaga(ACTION);
    expect(
      generator.next().value
    ).toEqual(call(
      sagasUtil.requestWithDispatcher,
      ACTION.meta.method,
      ACTION.meta.endpoint,
      ACTION.payload,
      ACTION.meta.deferred
    ));
  });
});
