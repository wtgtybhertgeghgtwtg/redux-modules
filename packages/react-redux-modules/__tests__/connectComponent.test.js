// @flow
import {identity} from 'lodash';
import PropTypes from 'prop-types';
import React, {Children, Component, type Node} from 'react';
import TestUtils from 'react-dom/test-utils';
import {Provider as ReactReduxProvider} from 'react-redux';
import {createStore} from 'redux';

import connectComponent from '../src/connectComponent';
import defaultMapModulesToProps from '../src/defaultMapModulesToProps';
import type {RegisterModules} from '../src/types';
import createModule, {type Action} from '../../redux-modules/src';

type MockProviderProps<S, A> = {
  children: Node,
  registerModules: RegisterModules,
  store: Store<S, A>,
};

/**
 * @private
 * A mock implementation of `Provider`.
 */
class MockProvider<S, A> extends Component<MockProviderProps<S, A>> {
  static childContextTypes = {
    registerModules: PropTypes.func,
    store: PropTypes.object,
  };

  getChildContext() {
    return {
      registerModules: this.props.registerModules,
      store: this.props.store,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

/**
 * @private
 * A stub component, since `div` would complain about getting odd props.  It's a class since `findRenderedComponentWithType` has trouble keeping track of functional components.
 */
class Child extends Component<{}> {
  render() {
    return <div />;
  }
}

const connector = connectComponent(identity, [], defaultMapModulesToProps, {
  connectWrapper: identity,
});

const ConnectedChild = connector(Child);

const dummyModule = createModule({
  initialState: {
    propOne: 1,
    propTwo: 'two',
  },
  name: 'dummy',
  transformations: {
    bumpPropOne: state => ({...state, propOne: state.propOne + 1}),
    setPropTwo: (state, action: Action<string>) => ({
      ...state,
      propTwo: action.payload,
    }),
  },
});

describe('connectComponent', () => {
  it('renders in a `react-redux` `Provider`.', () => {
    const store = createStore(dummyModule.reducer);
    expect(() =>
      TestUtils.renderIntoDocument(
        <ReactReduxProvider store={store}>
          <ConnectedChild />
        </ReactReduxProvider>,
      ),
    ).not.toThrow();
  });

  it('receives props from context.', () => {
    const registerModules = jest.fn();
    const store = createStore(dummyModule.reducer);
    const tree = TestUtils.renderIntoDocument(
      <MockProvider registerModules={registerModules} store={store}>
        <ConnectedChild />
      </MockProvider>,
    );
    const container = TestUtils.findRenderedComponentWithType(
      tree,
      ConnectedChild,
    );
    expect(container.context.registerModules).toBe(registerModules);
    // Since `react-redux` does this, might as well here.
    expect(container.context.store).toBe(store);
  });

  it('passes state and props to the component.', () => {
    const registerModules = jest.fn();
    const store = createStore(dummyModule.reducer);
    const tree = TestUtils.renderIntoDocument(
      <MockProvider registerModules={registerModules} store={store}>
        <ConnectedChild propThree={false} propTwo="three" />
      </MockProvider>,
    );
    const passthrough = TestUtils.findRenderedComponentWithType(tree, Child);
    expect(passthrough.props.propOne).toEqual(1);
    // Prioritizes state over props by default.
    expect(passthrough.props.propTwo).toEqual('two');
    expect(passthrough.props.propThree).toEqual(false);
  });

  it('subscribes to the store.', () => {
    const registerModules = jest.fn();
    const store = createStore(dummyModule.reducer);
    const tree = TestUtils.renderIntoDocument(
      <MockProvider registerModules={registerModules} store={store}>
        <ConnectedChild />
      </MockProvider>,
    );
    const passthrough = TestUtils.findRenderedComponentWithType(tree, Child);
    expect(passthrough.props.propOne).toEqual(1);
    expect(passthrough.props.propTwo).toEqual('two');
    store.dispatch(dummyModule.actionCreators.bumpPropOne());
    expect(passthrough.props.propOne).toEqual(2);
    expect(passthrough.props.propTwo).toEqual('two');
    store.dispatch(dummyModule.actionCreators.setPropTwo('three'));
    expect(passthrough.props.propOne).toEqual(2);
    expect(passthrough.props.propTwo).toEqual('three');
  });
});
