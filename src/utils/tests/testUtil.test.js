/* eslint-disable redux-saga/yield-effects */

import Notifications from 'react-notification-system-redux';
import { put } from 'redux-saga/effects';
import * as testUtil from 'utils/testUtil';
// import { AsmVersion } from 'models/asm';

describe('testUtil', () => {
  it('compareNotifications ignores callbacks', () => {
    const notificationOne = put(Notifications.warning({
      title: 'TEST_TITLE',
      message: 'TEST_MESSAGE',
      autoDismiss: false,
      action: {
        label: 'TEST_LABEL',
        callback: () => {},
      },
    }));
    const notificationTwo = put(Notifications.warning({
      title: 'TEST_TITLE',
      message: 'TEST_MESSAGE',
      autoDismiss: false,
      action: {
        label: 'TEST_LABEL',
        callback: () => {},
      },
    }));

    expect(notificationOne).not.toEqual(notificationTwo);
    testUtil.compareNotifications(notificationOne, notificationTwo);
  });

  // it('compareIgnoringDates ignores createdAt and updatedAt', () => {
  //   const asmOne = new AsmVersion();
  //   let asmTwo = new AsmVersion();
  //   asmTwo = asmTwo.set(
  //     'createdAt',
  //     new Date(123)
  //   ).set(
  //     'updatedAt',
  //     new Date(321)
  //   );
  //
  //   expect(asmOne).not.toEqual(asmTwo);
  //   testUtil.compareIgnoringDates(asmOne.toJS(), asmTwo.toJS());
  // });
});
