import { shallow } from 'enzyme';
import React from 'react';

import AuthPage from '../index';

describe('<AuthPage />', () => {
  it('Should render', () => {
    const renderedComponent = shallow(
      <AuthPage />
    );

    expect(renderedComponent.find('div')).toHaveLength(1);
  });
});
