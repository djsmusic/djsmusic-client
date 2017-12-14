// @flow

import { Map, OrderedMap } from 'immutable';

import { FAILURE, PENDING, SUCCESS, pending, failure, success } from 'utils/actionsUtil';
import type { Action } from 'definitions/action';

import asyncLoggerReducer, { initialState, CLEAR_ASYNC } from '../asyncLoggerReducer';

const TEST_ACTION = 'RANDOM_ACTION';
const uuid = 'test-uuid';

describe('asyncLoggerReducer', () => {
  it('Doesn\'t log random actions', () => {
    const action: Action = {
      type: TEST_ACTION,
      payload: {},
      meta: {
        log: true,
      },
    };
    const expectedState = initialState;

    expect(asyncLoggerReducer(undefined, action)).toEqual(expectedState);
  });

  it('Log PENDING async actions if log: false', () => {
    const action: Action = {
      type: pending(TEST_ACTION),
      payload: {
        action: {
          type: TEST_ACTION,
          payload: 'test',
        },
      },
      meta: {
        uuid,
        log: false,
      },
    };

    const expectedState = initialState.set(
      action.payload.action.type,
      OrderedMap()
    ).mergeIn(
      [action.payload.action.type, action.meta.uuid],
      Map({
        state: PENDING,
        response: null,
        action: action.payload.action,
      })
    );

    expect(asyncLoggerReducer(undefined, action)).toEqual(expectedState);
  });

  it('Logs PENDING async actions if log: true', () => {
    const action: Action = {
      type: pending(TEST_ACTION),
      payload: {
        action: {
          type: TEST_ACTION,
          payload: 'test',
        },
      },
      meta: {
        uuid,
        log: true,
      },
    };

    const expectedState = initialState.set(
      action.payload.action.type,
      OrderedMap()
    ).mergeIn(
      [action.payload.action.type, action.meta.uuid],
      Map({
        state: PENDING,
        response: null,
        action: action.payload.action,
      })
    );

    expect(asyncLoggerReducer(undefined, action)).toEqual(expectedState);
  });

  it('Logs FAILURE async actions if log: true', () => {
    const action: Action = {
      type: failure(TEST_ACTION),
      payload: {},
      meta: {
        type: TEST_ACTION,
        uuid,
        log: true,
      },
    };

    const pendingState = initialState.set(
      action.meta.type,
      // $FlowFixMe OrderedMap() is returning a Map() - there are issues already for this
      OrderedMap()
    );

    const expectedState = pendingState.mergeIn(
      [action.meta.type, action.meta.uuid],
      Map({
        state: FAILURE,
        response: action.payload,
      })
    );

    expect(asyncLoggerReducer(pendingState, action)).toEqual(expectedState);
  });

  it('Skips FAILURE async actions if log: false', () => {
    const action: Action = {
      type: failure(TEST_ACTION),
      payload: {},
      meta: {
        type: TEST_ACTION,
        uuid,
        log: false,
      },
    };

    const pendingState = initialState.set(
      action.meta.type,
      // $FlowFixMe OrderedMap() is returning a Map() - there are issues already for this
      OrderedMap()
    );

    expect(asyncLoggerReducer(pendingState, action)).toEqual(initialState);
  });

  it('Logs SUCCESS async actions if log: true', () => {
    const action: Action = {
      type: success(TEST_ACTION),
      payload: {},
      meta: {
        type: TEST_ACTION,
        uuid,
        transition: null,
        log: true,
      },
    };

    const pendingState = initialState.set(
      action.meta.type,
      // $FlowFixMe OrderedMap() is returning a Map() - there are issues already for this
      OrderedMap()
    );

    const expectedState = pendingState.mergeIn(
      [action.meta.type, action.meta.uuid],
      Map({
        state: SUCCESS,
        response: action.payload,
      })
    );

    expect(asyncLoggerReducer(pendingState, action)).toEqual(expectedState);
  });

  it('Skips SUCCESS async actions if log: false', () => {
    const action: Action = {
      type: success(TEST_ACTION),
      payload: {},
      meta: {
        type: TEST_ACTION,
        uuid,
        log: false,
      },
    };

    const pendingState = initialState.set(
      action.meta.type,
      // $FlowFixMe OrderedMap() is returning a Map() - there are issues already for this
      OrderedMap()
    );

    expect(asyncLoggerReducer(pendingState, action)).toEqual(initialState);
  });

  it('Clears an action on CLEAR_ASYNC', () => {
    const action: Action = {
      type: CLEAR_ASYNC,
      payload: {
        action: TEST_ACTION,
      },
      meta: {},
    };

    const pendingState = initialState.set(
      TEST_ACTION,
      // $FlowFixMe OrderedMap() is returning a Map() - there are issues already for this
      OrderedMap()
    );

    expect(asyncLoggerReducer(pendingState, action)).toEqual(initialState);
  });
});
