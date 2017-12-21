// @flow

/**
 * Expose all of the endpoint names
 */
export const endpoints = {
  // Auth
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  // General endpoints
  USER: 'USER',
  USER_CURRENT: 'USER_CURRENT',
};

/**
 * This exposes all of the API endpoints as a self executing function.
 * It's done this way so that endpoints can self reference previously declared ones,
 * which simplifies the api definition and minimizes inconsistency errors.
 */
export default new function api() {
  const API_URL = process.env.API_URL;
  // Auth
  this[endpoints.AUTH_LOGIN] = `${API_URL}/auth/login`;
  this[endpoints.AUTH_LOGOUT] = `${API_URL}/auth/logout`;
  // Misc
  this[endpoints.USER] = `${API_URL}/user/:id`;
  this[endpoints.USER_CURRENT] = `${API_URL}/user/me`;
}();
