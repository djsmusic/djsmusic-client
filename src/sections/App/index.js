// @flow

/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import Helmet from 'react-helmet';
import { ImmutableLoadingBar as LoadingBar } from 'react-redux-loading-bar';
import { HotKeys } from 'react-hotkeys';
import classNames from 'classnames';
import { Switch, withRouter } from 'react-router-dom';
import { compose } from 'redux';

import 'semantic-ui-css/semantic.css';

import AuthenticatedRoute from 'containers/Routes/AuthenticatedRoute';
import UnauthenticatedRoute from 'containers/Routes/UnauthenticatedRoute';
import injectSaga from 'utils/injectSaga';

import AuthPage from 'sections/AuthPage/Loadable';
import Site from 'sections/Site/Loadable';

// import 'semantic-ui-less/definitions/globals/reset.less';
// import 'semantic-ui-less/definitions/globals/site.less';
// import 'semantic-ui-less/semantic.less';
// import 'styles/main.less';

import saga from './sagas';

// key map for consistent hotkeys through out the application
const keyMap = {
  deleteNode: ['del', 'backspace'],
  right: ['right'],
  left: ['left'],
  up: ['up'],
  down: ['down'],
  selectAll: ['command+a', 'ctrl+a'],
  undo: ['command+z', 'ctrl+z'],
  redo: ['command+shift+z', 'ctrl+shift+z'],
  fullscreen: ['command+shift+f', 'ctrl+shift+f'],
};

type Props = {
  location: any,
};

class App extends React.PureComponent {
  props: Props;

  render() {
    return (
      <HotKeys keyMap={ keyMap } className={ classNames('wrapper flex-grow', { 'bg-fade': this.props.location.pathname === '/auth' }) }>
        <Helmet
          titleTemplate='%s - DJs Music'
          defaultTitle='DJs Music'
          meta={ [
            { name: 'description', content: 'DJs Music' },
          ] }
        />
        <LoadingBar
          className='loadingBar'
        />
        <Switch>
          <UnauthenticatedRoute
            exact
            path='/auth'
            component={ AuthPage }
          />
          <AuthenticatedRoute
            path='/'
            component={ Site }
          />
        </Switch>
      </HotKeys>
    );
  }
}

const withSaga = injectSaga({ key: 'app', saga });

export default compose(
  withRouter,
  withSaga
)(App);
