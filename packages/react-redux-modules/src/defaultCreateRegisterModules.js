// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import {has, set} from 'lodash';
import {combineReducers, type Store} from 'redux';

import type {ReducerMap, RegisterModules} from './types';

/**
 * @private
 * Creates the default module registration function.
 * @param {Store} store The Redux store.
 * @param {ReducerMap} reducers A collection of reducers to preload into the registry.
 * @return {RegisterModules} The module registration function.
 */
export default function defaultCreateRegisterModules<S: Object>(
  store: Store<$Shape<S>, *>,
  reducers: ?ReducerMap,
): RegisterModules {
  const registry: ReducerMap = {...reducers};
  return function registerModules(modules: Array<ReduxModule<*, *>>) {
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
