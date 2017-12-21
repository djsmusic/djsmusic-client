// @flow

/**
*
* AuthPage
*
*/

import React from 'react';
import Helmet from 'react-helmet';
import { Container, Loader } from 'semantic-ui-react';

import Logo from 'assets/img/logo/small.png';

type Props = {
  location: ?any,
};

class AuthPage extends React.PureComponent {
  props: Props;

  render() {
    const containerStyle = {
      marginTop: '5%',
      textAlign: 'center',
      background: 'black',
      color: 'white',
    };
    const textStyle = {
      marginTop: '5%',
    };
    const imgStyle = {
      marginBottom: '2rem',
    };
    return (
      <Container text style={ containerStyle }>
        <Helmet title='Authentication' />
        <div style={ textStyle } >
          <img src={ Logo } alt='DJs Music' style={ imgStyle } />
        </div>
        Login Page
      </Container>
    );
  }
}

export default AuthPage;
