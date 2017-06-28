// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Provider as ReactProvider} from 'react-redux';
import {createStore, type Store} from 'redux';

import defaultCreateRegisterModules from './defaultCreateRegisterModules';

export type CreateRegisterModules<S, A> = (
  store: Store<S, A>,
) => (modules: Array<ReduxModule<*, *, *>>) => void;

export type ProviderProps<S, A> = {
  children?: any,
  createRegisterModules?: CreateRegisterModules<S, A>,
  store?: Store<S, A>,
};

export type ProviderContext<S, A> = {
  registerModules: Function,
  store: Store<S, A>,
};

export default class Provider<S: Object, A> extends Component<
  void,
  ProviderProps<S, A>,
  void,
> {
  props: ProviderProps<S, A>;
  registerModules: (modules: Array<ReduxModule<*, *, *>>) => void;
  store: Store<S, *>;

  static childContextTypes = {
    registerModules: PropTypes.func.isRequired,
  };

  constructor(props: ProviderProps<S, A>, context: ProviderContext<S, A>) {
    super(props, context);
    const {createRegisterModules = defaultCreateRegisterModules} = props;
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
