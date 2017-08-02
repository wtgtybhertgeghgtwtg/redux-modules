// @flow
import {at, map} from 'lodash';

import type {ReduxModule} from '@wtg/redux-modules';

/**
 * @private
 * Creates an implicit selector for an array of modules.
 * @example
 * // state => state[exampleModule.name]
 * createImplicitSelector(exampleModule);
 * // state => ({...state[exampleModule.name], ...state[otherExampleModule.name]});
 * createImplicitSelector([exampleModule, otherExampleModule]);
 * @example
 * @param {Array<ReduxModule>} modules Modules whose names will be used to determine which parts of the state to be selected.
 * @return {Selector} The created selector function.
 */
export default function createImplicitSelector(
  modules: Array<ReduxModule<*, *, *>>,
) {
  const names = map(modules, 'name');
  // This is difficult to express in Flow.
  // `state` should be an unsealed object with properties of the `S` type of each module, keyed by the `name` of that module.
  return (state: Object) => Object.assign({}, ...at(state, names));
}
