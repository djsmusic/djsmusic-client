import React, { Component } from 'react';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';
import TestUtils from 'react-dom/test-utils';

function wrapInTestContext(DecoratedComponent) {
  return DragDropContext(TestBackend)(
    // eslint-disable-next-line react/prefer-stateless-function
    class TestContextContainer extends Component {
      render() {
        return <DecoratedComponent { ...this.props } />;
      }
    }
  );
}

export function getManager(TestComponent, props) {
  const WrappedComponent = wrapInTestContext(TestComponent);
  const root = TestUtils.renderIntoDocument(<WrappedComponent { ...props } />);
  return root.getManager();
}
