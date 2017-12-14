// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ErrorBoundary from 'components/ErrorBoundary';

import * as actions from 'containers/ErrorHistory/actions';

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(ErrorBoundary);
