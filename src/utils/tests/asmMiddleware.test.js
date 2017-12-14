import { memoryHistory } from 'react-router-dom';

import { apiAction } from 'utils/sagaApiMiddleware';
import { NAMESPACE, USER_STACK } from 'containers/StackContainer/constants';

import asmMiddleware from '../asmMiddleware';
import configureStore from '../../store';

describe('asmMiddleware', () => {
  describe('Non editing state', () => {
    let store;
    let dispatchAction;

    beforeEach(() => {
      store = configureStore({}, memoryHistory);

      dispatchAction = (action) => {
        let dispatched = null;
        const dispatch = asmMiddleware()(store)((actionAttempt) => {
          dispatched = actionAttempt;
        });
        dispatch(action);
        return dispatched;
      };
    });

    it('Does nothing on non ASM actions', () => {
      const action = {
        type: 'RANDOM_ACTION',
        payload: {
          test: 1,
        },
        meta: {
          test: 2,
        },
      };

      const transformedAction = dispatchAction(action);

      expect(transformedAction).toEqual(action);
    });

    it('Ignores action if the ASM is not in edit mode', () => {
      const action = {
        type: 'ASM-PUT-ASM_ATTRIBUTE',
        payload: {
          test: 1,
        },
        meta: {
          test: 2,
        },
      };

      const transformedAction = dispatchAction(action);

      expect(transformedAction).toEqual(action);
    });
  });

  describe('asmMiddleware', () => {
    const EDITING_VERSION = 1;
    const EDITING_SCOPE = 2;
    const SLUG_ID = 'TEST SLUG ID';
    let store;
    let dispatchAction;

    beforeEach(() => {
      store = configureStore({
        [NAMESPACE]: {
          current: {
            stack: USER_STACK,
          },
          userStack: {
            editing: {
              internalId: EDITING_VERSION,
              scopeId: EDITING_SCOPE,
            },
          },
        },
      }, memoryHistory);

      dispatchAction = (action) => {
        let dispatched = null;
        const dispatch = asmMiddleware()(store)((actionAttempt) => {
          dispatched = actionAttempt;
        });
        dispatch(action);
        return dispatched;
      };
    });

    it('Does nothing on non ASM actions', () => {
      const action = {
        type: 'RANDOM_ACTION',
        payload: {
          test: 1,
        },
        meta: {
          test: 2,
        },
      };

      const transformedAction = dispatchAction(action);

      expect(transformedAction).toEqual(action);
    });

    it('Ignores delete actions if its missing a slug id', () => {
      const action = {
        type: 'ASM-DELETE-ASM_ATTRIBUTE',
        payload: {
          test: 1,
        },
        meta: {
          test: 2,
        },
      };

      const transformedAction = dispatchAction(action);

      expect(transformedAction).toEqual(action);
    });

    it('Transforms the action into the correct API call', () => {
      const action = {
        type: 'ASM-PUT-ASM_ATTRIBUTE',
        payload: {
          test: 1,
        },
        meta: {
          params: {
            slugId: SLUG_ID,
          },
          test: 2,
        },
      };

      const transformedAction = dispatchAction(action);

      expect(transformedAction.type).toEqual(apiAction('PUT', 'ASM_ATTRIBUTE'));
      expect(transformedAction.meta.params.internalId).toEqual(
        EDITING_VERSION
      );
      expect(transformedAction.meta.params.asmScopeId).toEqual(
        EDITING_SCOPE
      );
    });
  });
});
