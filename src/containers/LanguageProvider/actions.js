// @flow

/*
 *
 * LanguageProvider actions
 *
 */

import {
  CHANGE_LOCALE,
} from './constants';

export function changeLocale(languageLocale: string): any {
  return {
    type: CHANGE_LOCALE,
    payload: {
      locale: languageLocale,
    },
  };
}
