// @flow
import {at, map} from 'lodash';

import type {ReduxModule} from '@wtg/redux-modules';

export default function createImplicitSelector(
  modules: Array<ReduxModule<*, *, *>>,
) {
  const names = map(modules, 'name');
  // This is difficult to express in Flow.
  // `state` should be an unsealed object with properties of the `S` type of each module, keyed by the `name` of that module.
  return (state: Object) => Object.assign({}, ...at(state, names));
}
