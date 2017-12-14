// @flow

/**
 * AuthenticatedRoute - Only renders the component if the current user is logged in.
 *
 * It redirects to auth otherwise
 */

import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { compose, bindActionCreators } from 'redux';

import * as actions from 'containers/AuthContainer/actions';

import selectors from './selectors';

type Props = {
  component: Function,
  location: any,
  history: any,
  path: string,
  auth: {
    isLoading: boolean,
    isAuthenticated: boolean,
  },
  actions: {
    getUser(): void,
  },
};

class AuthenticatedRoute extends React.PureComponent {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.shouldRedirect(props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.shouldRedirect(nextProps);
  }

  shouldRedirect(props: Props) {
    if (!props.auth.isLoading && !props.auth.isAuthenticated) {
      props.history.push(
        '/auth',
        {
          from: props.location,
        }
      );
    }
  }

  render() {
    if (this.props.auth.isLoading) {
      this.props.actions.getUser();
      return (
        <Loader active>
          Loading...
        </Loader>
      );
    }
    if (this.props.auth.isAuthenticated) {
      return (
        <Route
          { ...this.props }
        />
      );
    }
    return null;
  }
}

const mapStateToProps = selectors();

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  withRouter
)(AuthenticatedRoute);
