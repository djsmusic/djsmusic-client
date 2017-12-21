// @flow

export function mustLogError(actual: Object) {
  expect(actual.PUT.action.type).toEqual(LOG_EVENT);
}
