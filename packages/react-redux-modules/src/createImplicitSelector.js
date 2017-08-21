// @flow
import {at} from 'lodash';

import type {ReduxModule} from '@wtg/redux-modules';
import type {MapStateToProps} from 'react-redux';

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
export default function createImplicitSelector<S: Object>(
  modules: Array<ReduxModule<$Shape<S>, {}>>,
): MapStateToProps<{[name: string]: $Shape<S>}, Object, S> {
  const names = modules.map(reduxModule => reduxModule.name);
  return state => {
    const moduleStates: Array<$Shape<S>> = at(state, names);
    return Object.assign({}, ...moduleStates);
  };
}
