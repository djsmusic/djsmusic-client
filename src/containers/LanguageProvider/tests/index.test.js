import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router-dom';
import { shallow } from 'enzyme';
import { FormattedMessage, defineMessages } from 'react-intl';

import LanguageProvider from '../index';

import configureStore from '../../../store';
import { translationMessages } from '../../../i18n';

describe('<LanguageProvider />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the default language messages', () => {
    const messages = defineMessages({
      someMessage: {
        id: 'some.id',
        defaultMessage: 'This is some default message',
      },
    });
    const renderedComponent = shallow(
      <Provider store={ store }>
        <LanguageProvider messages={ translationMessages }>
          <FormattedMessage { ...messages.someMessage } />
        </LanguageProvider>
      </Provider>
    );
    expect(renderedComponent.contains(<FormattedMessage { ...messages.someMessage } />)).toEqual(true);
  });
});
