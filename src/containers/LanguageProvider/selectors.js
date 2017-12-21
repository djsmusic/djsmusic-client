// @flow

import { createSelector } from 'reselect';

import type { LanguageState } from './reducer';
import { NAMESPACE } from './constants';

const selectLocale = () => createSelector(
  (state: any) => state.get(NAMESPACE),
  (languageState: LanguageState) => languageState.get('locale'),
);

export {
  selectLocale,
};
