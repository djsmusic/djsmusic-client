// @flow

export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const CSRF_HEADER = 'X-CSRF-TOKEN';

export const ASYNC_NAMESPACE = 'async';

export type RequestParams = {
  method: string,
  url: string,
  payload: any,
};
