// @flow

import { takeEvery } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { requestWithDispatcher } from 'utils/sagasUtil';
import resource from 'resource-path';

import { API_CALL } from 'sections/App/constants';
import type { Action } from 'definitions/action';

export function* apiSaga(action: Action): any {
  yield call(
    requestWithDispatcher,
    action.meta.method,
    resource(action.meta.endpoint, action.meta.params),
    action.payload,
    action.meta.deferred,
  );
}

export default function* watcher(): any {
  yield takeEvery(API_CALL, apiSaga);
}
