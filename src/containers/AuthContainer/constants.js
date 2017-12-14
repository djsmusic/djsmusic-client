// @flow

import { endpoints } from 'api';
import { apiAction } from 'utils/sagaApiMiddleware';

export const NAMESPACE = 'auth';

// API Calls
export const API_LOGOUT = apiAction('POST', endpoints.AUTH_LOGOUT);
export const API_GET_USER = apiAction('GET', endpoints.USER_CURRENT);
