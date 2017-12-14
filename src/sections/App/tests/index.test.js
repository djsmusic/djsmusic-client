import React from 'react';
import { shallow } from 'enzyme';
import { HotKeys } from 'react-hotkeys';
import App from '../index';

describe('<App />', () => {
  it('Should render', () => {
    const renderedComponent = shallow(
      <App />
    );
    expect(renderedComponent.find(HotKeys)).toHaveLength(0);
  });
});
