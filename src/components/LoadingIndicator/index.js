import React from 'react';
import { Message, Loader } from 'semantic-ui-react';

const LoadingIndicator = ({
  isLoading, timedOut, pastDelay, error,
}) => {
  if (isLoading) {
    if (timedOut) {
      return (
        <Message warning content='Loading seems to be taking too long... Please try again later.' />
      );
    } else if (pastDelay) {
      return (
        <Loader active />
      );
    }
    return null;
  } else if (error) {
    console.error('LoadingIndicator Error', error);
    return (
      <Message warning content='An error occurred loading the page. Please try again later.' />
    );
  }
  return null;
};

export default LoadingIndicator;
