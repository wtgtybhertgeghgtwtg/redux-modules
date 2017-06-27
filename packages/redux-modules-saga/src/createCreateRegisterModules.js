// @flow
import {forEach, has, set} from 'lodash';
import {combineReducers, type Reducer, type Store} from 'redux';

import type {ReduxModule} from './types';

export default function createCreateRegisterModules(sagaMiddleware: {
  run: Function,
}) {
  return function createRegisterModules<S: Object>(store: Store<$Shape<S>, *>) {
    const registry: {[name: string]: Reducer<*, *>} = Object.create(null);
    return function registerModules(modules: Array<ReduxModule<*, *, *>>) {
      const unregisteredModules = modules.filter(
        ({name}) => !has(registry, name),
      );
      if (unregisteredModules.length === 0) {
        return;
      }
      unregisteredModules.forEach(({name, reducer, sagas}) => {
        set(registry, name, reducer);
        forEach(sagas, sagaMiddleware.run);
      });
      const reducer = combineReducers(registry);
      store.replaceReducer(reducer);
    };
  };
}
