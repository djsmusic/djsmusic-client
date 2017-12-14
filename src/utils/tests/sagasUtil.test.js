/* eslint-disable redux-saga/yield-effects */

import { put, call } from 'redux-saga/effects';
import Notifications from 'react-notification-system-redux';
import fetchMock from 'fetch-mock';

import * as sagasUtil from 'utils/sagasUtil';
import { success, failure, pending } from 'utils/actionsUtil';
import { RequestError, ApiError } from 'utils/errors';
import { compareNotifications, mustLogError } from 'utils/testUtil';

const METHOD = 'testMethod';
const URL = 'testUrl';
const ACTION_ID = 'test-uuid';
const ACTION = {
  type: 'SAMPLE_ACTION',
  payload: 'testPayload',
  meta: {
    uuid: ACTION_ID,
  },
};
const TEST_RESPONSE = {
  body: {
    mocked: true,
  },
  status: 200,
  headers: {
    [sagasUtil.CSRF_HEADER]: 'TEST_CSRF_HEADER_VALUE',
  },
};

describe('SagasUtil (Sagas helper methods)', () => {
  describe('requestWithDispatcher', () => {
    it('Calls the request method with the right parameters', () => {
      const generator = sagasUtil.requestWithDispatcher(METHOD, URL, ACTION);

      expect(
        generator.next().value
      ).toEqual(
        put({
          type: pending(ACTION.type),
          payload: { action: ACTION },
          meta: {
            uuid: ACTION_ID,
          },
        })
      );

      expect(
        generator.next().value
      ).toEqual(
        call(
          sagasUtil.request,
          {
            method: METHOD,
            url: URL,
            payload: ACTION.payload,
          },
        )
      );
    });
  });

  describe('requestWithOptions', () => {
    beforeEach(() => {
      fetchMock.restore();
    });

    it('Calls fetch with the right parameters and gets response', async () => {
      fetchMock.mock('*', TEST_RESPONSE);
      const data = await sagasUtil.requestWithOptions(URL);
      expect(data).toHaveProperty('response');
      expect(data.response).toEqual(TEST_RESPONSE.body);
    });

    it('Returns ApiError on non 2xx HTTP statuses', async () => {
      const customResponse = TEST_RESPONSE;
      customResponse.status = 404;
      customResponse.statusText = 'Not Found';
      fetchMock.mock('*', customResponse);
      const data = await sagasUtil.requestWithOptions(URL);
      expect(data).toHaveProperty('error');
      expect(data.error).toEqual(
        new ApiError(
          customResponse.status,
          customResponse.statusText,
          customResponse
        )
      );
    });
  });

  describe('processResponse', () => {
    it('Success without meta params', () => {
      const response = {
        test: 'success',
      };
      const generator = sagasUtil.processResponse(ACTION, ACTION_ID, response, null);

      expect(
        generator.next().value
      ).toEqual(
        put({
          type: success(ACTION.type),
          payload: response,
          meta: {
            type: ACTION.type,
            uuid: ACTION_ID,
            log: false,
            transition: null,
          },
        })
      );
    });

    it('Success with meta params: transition, notify, and log', () => {
      const response = {
        test: 'success',
      };

      const customAction = {
        ...ACTION,
        meta: {
          onSuccess: {
            log: true,
            notify: 'testing success',
            transition: {
              something: true,
            },
          },
        },
      };

      const generator = sagasUtil.processResponse(customAction, ACTION_ID, response, null);

      compareNotifications(
        generator.next().value,
        put(
          Notifications.success({
            message: customAction.meta.onSuccess.notify,
          })
        )
      );

      expect(
        generator.next().value
      ).toEqual(
        put({
          type: success(ACTION.type),
          payload: response,
          meta: {
            type: ACTION.type,
            uuid: ACTION_ID,
            log: true,
            transition: {
              something: true,
            },
          },
        })
      );
    });

    it('Failure without meta params', () => {
      const error = {
        name: 'test',
        message: 'testMessage',
        response: {
          test: 'something',
        },
      };
      const generator = sagasUtil.processResponse(ACTION, ACTION_ID, null, error);

      mustLogError(
        generator.next().value,
      );

      // Show notification
      compareNotifications(
        generator.next().value,
        put(
          Notifications.error({
            message: error.message,
            autoDismiss: false,
            children: null,
          })
        )
      );

      // Dispatch failure action
      expect(
        generator.next().value
      ).toEqual(
        put({
          type: failure(ACTION.type),
          payload: error,
          meta: {
            type: ACTION.type,
            uuid: ACTION_ID,
            log: false,
            transition: null,
          },
          error: true,
        })
      );
    });

    it('Failure without response', () => {
      const error = {
        name: 'test',
        message: 'testMessage',
        response: null,
      };
      const generator = sagasUtil.processResponse(ACTION, ACTION_ID, null, error);

      compareNotifications(
        generator.next().value,
        put(
          Notifications.warning({
            title: 'Offline!',
            message: 'Server not reachable.',
            autoDismiss: false,
            action: {
              label: 'Retry',
              callback: () => {
                window.dispatch(ACTION);
              },
            },
          })
        )
      );

      mustLogError(
        generator.next().value,
      );

      const generatedValue = generator.next().value;
      const expectedValue = put(
        Notifications.error({
          message: error.message,
          autoDismiss: false,
          children: null,
        })
      );

      // Make the timestamps match
      expectedValue.PUT.action.uid = generatedValue.PUT.action.uid;

      expect(generatedValue).toEqual(expectedValue);

      expect(
        generator.next().value
      ).toEqual(
        put({
          type: failure(ACTION.type),
          payload: new RequestError(error.message),
          meta: {
            type: ACTION.type,
            uuid: ACTION_ID,
            log: false,
            transition: null,
          },
          error: true,
        })
      );
    });

    it('Failure with meta params: transition, notify, and log', () => {
      const customAction = {
        ...ACTION,
        meta: {
          onFailure: {
            log: true,
            notify: true,
            transition: {
              something: true,
            },
          },
        },
      };

      const error = {
        name: 'test',
        message: 'testMessage',
        response: {
          test: 'something',
        },
      };

      const generator = sagasUtil.processResponse(customAction, ACTION_ID, null, error);

      mustLogError(
        generator.next().value,
      );

      compareNotifications(
        generator.next().value,
        put(
          Notifications.error({
            message: error.message,
            autoDismiss: false,
            children: null,
          })
        )
      );

      expect(
        generator.next().value
      ).toEqual(
        put({
          type: failure(ACTION.type),
          payload: error,
          meta: {
            type: ACTION.type,
            uuid: ACTION_ID,
            log: true,
            transition: {
              something: true,
            },
          },
          error: true,
        })
      );
    });
  });
});
