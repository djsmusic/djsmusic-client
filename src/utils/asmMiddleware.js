// @flow

import type { Store } from 'redux';

import type { Action } from 'definitions/action';
import { NAMESPACE } from 'containers/StackContainer/constants';
import { apiAction } from 'utils/sagaApiMiddleware';
import AsmStackUser from 'models/asm/AsmStackUser';
import type AsmStackScope from 'models/asm/AsmStackUser/AsmStackScope';
import { endpoints } from 'api';

/**
 * ASM Middleware
 * Enriches CRUD ASM requests with the scope/version IDs of the
 * version that is currently set to be edited (if any)
 *
 * Actions must be in the following format:
 *
 * {
 *   type: 'ASM_{METHOD}_{ASM_TABLE}',
 *   payload: {
 *     {data to be sent}
 *   },
 *   meta: {
 *     params: {
 *       slugId: "{SLUG ID}",
 *     },
 *   }
 * }
 *
 * Supported values:
 *   - METHOD: RELOAD, PUT, DELETE
 *   - ASM_TABLE: Valid ASM Table name
 *
 * RELOAD doesn't require to be in editing mode, it will simply reload the current stack.
 */
export default function asmMiddleware() {
  return (store: Store) => (next: Function) => (action: Action) => {
    const prefix = 'ASM-';
    const methods = ['RELOAD', 'PUT', 'DELETE'];
    // Validate the type of action, and the presence of the slug id
    if (action.type.substr(0, prefix.length) !== prefix) {
      // Not an ASM action
      return next(action);
    }

    const parts = action.type.split('-');
    const method = parts[1];
    const tableName = parts[2];

    if (methods.indexOf(method) < 0) {
      // Invalid method, ignore
      return next(action);
    }

    const state = store.getState().get(NAMESPACE);

    if (method === 'RELOAD') {
      const stackInternalIds = getPartsFromStack(new AsmStackUser(action.payload) || state.get('stack'));
      if (stackInternalIds.length < 1) {
        stackInternalIds.push(1); // TODO Hack for users without a stack
      }
      return next({
        type: apiAction('POST', endpoints.ASM_DYNAMIC_STACKED),
        payload: {
          parts: stackInternalIds,
        },
        meta: {
          onFailure: action.meta.onFailure,
          onSuccess: action.meta.onSuccess,
        },
      });
    }

    const currentStack = state.get('current').get('stack');
    const stackState = state.get(currentStack);
    if (!stackState) {
      return next(action);
    }

    const editing = stackState.get('editing');
    let slugId = null;
    if (action.meta && action.meta.params) {
      slugId = action.meta.params.slugId;
    }

    if (!editing || !editing.get('scopeId') || (method === 'DELETE' && !slugId)) {
      return next(action);
    }

    const asmScopeId = editing.get('scopeId');
    const internalId = editing.get('internalId');

    return next({
      type: apiAction(method, tableName),
      payload: action.payload,
      meta: {
        params: {
          asmScopeId,
          internalId,
          slugId,
        },
        onFailure: action.meta.onFailure,
        onSuccess: action.meta.onSuccess,
      },
    });
  };
}

export function getPartsFromStack(stack: AsmStackUser) {
  const stackInternalIds = [];
  stack.scopeList.forEach((entry: AsmStackScope) => {
    const internals = entry.uncommittedInternalList.toJS();
    stackInternalIds.push(...internals);
    stackInternalIds.push(entry.currentCommittedInternal);
  });
  return stackInternalIds;
}
