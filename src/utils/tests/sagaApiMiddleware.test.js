import { API_CALL } from 'sections/App/constants';
import { pending } from '../actionsUtil';
import sagaApiMiddleware from '../sagaApiMiddleware';
import api from '../../api';

const dispatchAction = (action) => {
  let dispatched = null;
  const dispatch = sagaApiMiddleware()()((actionAttempt) => {
    dispatched = actionAttempt;
  });
  dispatch(action);
  return dispatched;
};

describe('sagaApiMiddleware', () => {
  it('Does nothing on non API actions', () => {
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

  it('Does nothing on async actions', () => {
    const action = {
      type: pending('API-GET-USER'),
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

  it('Throws exception on non-existing endpoint', () => {
    const fakeEndpoint = 'RANDOM';
    const action = {
      type: `API-GET-${fakeEndpoint}`,
      payload: {
        test: 1,
      },
      meta: {
        test: 2,
      },
    };

    expect(() => {
      dispatchAction(action);
    }).toThrow(`Undefined endpoint '${fakeEndpoint}' in saga`);
  });

  it('Transforms API actions', () => {
    const action = {
      type: 'API-GET-USER',
      payload: {
        something: 'else',
      },
      meta: {
        notify: true,
        params: {
          test1: '1',
          test2: '2',
        },
      },
    };
    const transformedAction = dispatchAction(action);

    const defer = transformedAction.meta.deferred;

    expect(defer.promise);
    expect(defer.reject);
    expect(defer.resolve);

    delete transformedAction.meta.deferred;

    const apiAction = {
      type: API_CALL,
      payload: action,
      meta: {
        method: 'GET',
        endpoint: api.USER,
        params: action.meta.params,
      },
    };

    expect(transformedAction).toEqual(apiAction);
  });
});
