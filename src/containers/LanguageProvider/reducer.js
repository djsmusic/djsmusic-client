// @flow

/*
 *
 * LanguageProvider reducer
 *
 */

import { Map } from 'immutable';

import { DEFAULT_LOCALE } from 'sections/App/constants';
import type { Action } from 'definitions/action';

import { CHANGE_LOCALE } from './constants';

export type LanguageState = Map<string, string>;

const initialState: LanguageState = Map({
  locale: DEFAULT_LOCALE,
});

function languageProviderReducer(state: LanguageState = initialState, action: Action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return state.set('locale', action.payload.locale);
    default:
      return state;
  }
}

export default languageProviderReducer;
