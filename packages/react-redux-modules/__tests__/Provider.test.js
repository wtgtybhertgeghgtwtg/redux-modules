// @flow
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import TestUtils from 'react-dom/test-utils';
import {createStore} from 'redux';

import Provider from '../src/Provider';

/**
 * @private
 * A stub component, since `div` would complain about getting odd props.  It's a class since `findRenderedComponentWithType` has trouble keeping track of functional components.
 */
class Child extends Component<{}> {
  static contextTypes = {
    registerModules: PropTypes.func,
    store: PropTypes.object,
  };

  render() {
    return <div />;
  }
}

describe('Provider', () => {
  it('passes props to context.', () => {
    const store = createStore(() => ({}));
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Child />
      </Provider>,
    );
    const provider = TestUtils.findRenderedComponentWithType(tree, Provider);
    const child = TestUtils.findRenderedComponentWithType(tree, Child);
    expect(provider.store).toBe(store);
    expect(child.context.store).toBe(provider.store);
    expect(child.context.registerModules).toBe(provider.registerModules);
  });

  it('creates a store if none is given.', () => {
    const tree = TestUtils.renderIntoDocument(
      <Provider>
        <Child />
      </Provider>,
    );
    const provider = TestUtils.findRenderedComponentWithType(tree, Provider);
    const child = TestUtils.findRenderedComponentWithType(tree, Child);
    expect(provider.store).toBeDefined();
    expect(child.context.store).toBe(provider.store);
    expect(child.context.registerModules).toBe(provider.registerModules);
  });
});
