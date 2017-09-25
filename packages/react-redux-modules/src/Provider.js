// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import PropTypes from 'prop-types';
import React, {Component, type Node} from 'react';
import {Provider as ReactProvider} from 'react-redux';
import {createStore, type Store} from 'redux';

import defaultCreateRegisterModules from './defaultCreateRegisterModules';
import type {ReducerMap} from './types';

export type CreateRegisterModules<S, A> = (
  store: Store<S, A>,
  reducers: ?ReducerMap,
) => (modules: Array<ReduxModule<*, *>>) => void;

export type ProviderProps<S, A> = {
  children: Node,
  createRegisterModules?: CreateRegisterModules<S, A>,
  reducers?: ReducerMap,
  store?: Store<S, A>,
};

export type ProviderContext<S, A> = {
  registerModules: Function,
  store: Store<S, A>,
};

/**
 * The Provider component.  Allows `connect` descendant calls to access the store.
 */
export default class Provider<S: Object, A> extends Component<
  ProviderProps<S, A>,
> {
  props: ProviderProps<S, A>;
  registerModules: (modules: Array<ReduxModule<*, *>>) => void;
  store: Store<S, *>;

  static childContextTypes = {
    registerModules: PropTypes.func.isRequired,
  };

  constructor(props: ProviderProps<S, A>, context: ProviderContext<S, A>) {
    super(props, context);
    const {
      createRegisterModules = defaultCreateRegisterModules,
      reducers,
      store = createStore((state: S) => state),
    } = props;
    this.store = store;
    this.registerModules = createRegisterModules(store, reducers);
  }

  getChildContext() {
    return {
      registerModules: this.registerModules,
    };
  }

  render() {
    const {children} = this.props;
    const store = this.store;
    return <ReactProvider store={store}>{children}</ReactProvider>;
  }
}
