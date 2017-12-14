// @flow

export const PENDING = 'PENDING';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export function pending(actionType: string) {
  return `${actionType}-${PENDING}`;
}

export function success(actionType: string) {
  return `${actionType}-${SUCCESS}`;
}

export function failure(actionType: string) {
  return `${actionType}-${FAILURE}`;
}
