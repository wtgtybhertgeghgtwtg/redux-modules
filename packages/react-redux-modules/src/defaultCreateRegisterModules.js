// @flow
import {has, set} from 'lodash';
import {combineReducers, type Reducer, type Store} from 'redux';

import type {ReduxModule} from '@wtg/redux-modules';

export default function defaultCreateRegisterModules<S: Object>(
  store: Store<$Shape<S>, *>,
) {
  const registry: {[name: string]: Reducer<*, *>} = Object.create(null);
  return function registerModules(modules: Array<ReduxModule<*, *, *>>) {
    const unregisteredModules = modules.filter(
      ({name}) => !has(registry, name),
    );
    if (unregisteredModules.length === 0) {
      return;
    }
    unregisteredModules.forEach(({name, reducer}) =>
      set(registry, name, reducer),
    );
    const reducer = combineReducers(registry);
    store.replaceReducer(reducer);
  };
}
