// @flow

/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import { NAMESPACE } from './constants';

import reducer from './reducer';
import { selectLocale } from './selectors';

export class LanguageProvider extends React.PureComponent {
  render() {
    return (
      <IntlProvider locale={ this.props.locale } key={ this.props.locale } messages={ this.props.messages[this.props.locale] }>
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}


const mapStateToProps = createSelector(
  selectLocale(),
  (locale) => ({ locale })
);

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: NAMESPACE, reducer });

export default compose(
  withReducer,
  withConnect
)(LanguageProvider);
