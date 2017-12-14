// @flow

import { LOG_EVENT } from 'containers/ErrorHistory/constants';

type NotificationAction = {
  [key: string]: {
    action: {
      uid: string,
      action: {
        label: string,
        callback: any,
      },
    },
  },
};

export function compareNotifications(actual: NotificationAction, expected: NotificationAction) {
  const actualNotification = actual;
  const expectedNotification = expected;

  actualNotification.PUT.action.uid = 'test';
  expectedNotification.PUT.action.uid = actualNotification.PUT.action.uid;

  // Fix for callback function comparison
  if (actualNotification.PUT.action.action && actualNotification.PUT.action.action.callback) {
    actualNotification.PUT.action.action.callback = 'test';
    expectedNotification.PUT.action.action.callback = actualNotification.PUT.action.action.callback;
  }

  expect(
    actualNotification
  ).toEqual(
    expectedNotification
  );
}

function deepList(obj, prop, value) {
  if (!obj) return obj;
  const ret = Object.create(obj);
  Object.keys(obj).forEach((property) => {
    if (typeof obj[property] === 'object') {
      ret[property] = deepList(obj[property], prop, value);
    } else if (property === prop) {
      ret[property] = value; // eslint-disable-line no-param-reassign
    }
  });
  return ret;
}

export function compareIgnoringDates(actual: Object, expected: Object) {
  let actualModified = actual;
  let expectedModified = expected;

  const CREATED = 'createdAt';
  const UPDATED = 'updatedAt';

  actualModified = deepList(actualModified, CREATED, '');
  actualModified = deepList(actualModified, UPDATED, '');

  expectedModified = deepList(expectedModified, CREATED, '');
  expectedModified = deepList(expectedModified, UPDATED, '');

  expect(actualModified).toEqual(expectedModified);
}

export function mustLogError(actual: Object) {
  expect(actual.PUT.action.type).toEqual(LOG_EVENT);
}
