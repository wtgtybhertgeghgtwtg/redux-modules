// @flow
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Provider as ReactProvider} from 'react-redux';
import {createStore} from 'redux';

import createRegisterModules from './createRegisterModules';

import type {Store} from 'redux';
import type {Action, ReduxModule} from '@wtg/redux-modules';

export type ProviderProps<S> = {
  store?: Store<S, Action<*, *>>,
  children?: any,
};

export type ProviderContext<S> = {
  registerModule: Function,
  store: Store<S, Action<*, *>>,
};

export default class Provider<S: Object> extends Component<void, ProviderProps<S>, void> {
  props: ProviderProps<S>;
  registerModules: (modules: Array<ReduxModule<*, *>>) => void;
  store: Store<S, Action<*, *>>;

  static childContextTypes = {
    registerModule: PropTypes.func.isRequired,
  };

  constructor(props: ProviderProps<S>, context: ProviderContext<S>) {
    super(props, context);
    this.store = props.store || createStore((state: S) => state);
    this.registerModules = createRegisterModules(this.store);
  }

  getChildContext() {
    return {
      registerModules: this.registerModules,
    };
  }

  render() {
    const {children} = this.props;
    const store = this.store;
    return (
      <ReactProvider store={store}>
        {children}
      </ReactProvider>
    );
  }
}
