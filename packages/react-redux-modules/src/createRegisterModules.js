// @flow
import {has, set} from 'lodash';
import {combineReducers, type Reducer, type Store} from 'redux';

import type {ReduxModule} from '@wtg/redux-modules';

export default function createRegisterModules<S: Object>(store: Store<*, *>) {
  const registry: {[name: string]: Reducer<*, *>} = Object.create(null);
  return function registerModules(modules: Array<ReduxModule<*, *, *>>) {
    const unregisteredModules: Array<ReduxModule<*, *, *>> = modules.filter(
      ({name}: ReduxModule<*, *, *>) => !has(registry, name),
    );
    if (unregisteredModules.length === 0) {
      return;
    }
    unregisteredModules.forEach(({name, reducer}: ReduxModule<*, *, *>) =>
      set(registry, name, reducer),
    );
    const reducer = combineReducers(registry);
    store.replaceReducer(reducer);
  };
}
