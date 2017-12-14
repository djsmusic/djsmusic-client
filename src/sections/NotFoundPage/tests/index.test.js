import { shallow } from 'enzyme';
import React from 'react';

import NotFoundPage from '../index';

describe('<NotFoundPage />', () => {
  it('Should render', () => {
    const renderedComponent = shallow(
      <NotFoundPage />
    );
    expect(renderedComponent.find('h1')).toHaveLength(1);
  });
});
