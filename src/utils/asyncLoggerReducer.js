// @flow

import { List, Map, OrderedMap } from 'immutable';
import type { Record } from 'immutable';

import { PENDING, SUCCESS, FAILURE } from 'utils/actionsUtil';
import type { Action } from 'definitions/action';

export type AsyncAction = Record<{
  state: string,
  response: any,
  action: Action,
}>;
export type AsyncState = Map<string, OrderedMap<string, List<AsyncAction>>>;

const asyncStates = [PENDING, SUCCESS, FAILURE];
export const initialState: AsyncState = Map();

export const CLEAR_ASYNC = 'app/asyncLoggerReducer/CLEAR_ASYNC';

/**
 * This reducer logs any async actions to the state. It achieves this by listening on all actions
 * and then determining whether they are an async function.
 *
 * If the actions contain an action.meta.log boolean, it will be used to determine whether to actually
 * log the action or not. Unless the action outcome is going to be used to display an AsyncAlert or another
 * method of notification actions shouldn't be logged.
 * @param state
 * @param action
 */
export default function asyncLoggerReducer(state: AsyncState = initialState, action: Action) {
  if (action.type) {
    switch (action.type) {
      case CLEAR_ASYNC:
        return clearAsync(state, action);
      default:
    }

    const actionParts = action.type.split('-');
    if (actionParts.length > 1) {
      const asyncType = actionParts[actionParts.length - 1];
      if (asyncStates.indexOf(asyncType) > -1) {
        switch (asyncType) {
          case PENDING: {
            let newState = state;
            if (!state.get(action.payload.action.type)) {
              newState = state.set(
                action.payload.action.type,
                // $FlowFixMe OrderedMap() is returning a Map() - there are issues already for this
                OrderedMap()
              );
            }
            return newState.mergeIn(
              [action.payload.action.type, action.meta.uuid],
              Map({
                state: asyncType,
                response: null,
                action: action.payload.action,
              })
            );
          }
          case SUCCESS:
          case FAILURE:
            if (!action.meta || !action.meta.type) {
              return state;
            }
            if (action.meta && !action.meta.log) {
              return state.remove(action.meta.type);
            }
            return state.mergeIn(
              [action.meta.type, action.meta.uuid],
              Map({
                state: asyncType,
                response: action.payload,
              })
            );
          default:
        }
      }
    }
  }

  return state;
}

export function clearAsync(state: AsyncState, action: Action) {
  const clearAction = action.payload.action;

  return state.delete(clearAction);
}
