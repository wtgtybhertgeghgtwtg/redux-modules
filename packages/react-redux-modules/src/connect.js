// @flow
import invariant from 'invariant';
import {castArray} from 'lodash';

import connectComponent from './connectComponent';
import createImplicitSelector from './createImplicitSelector';

import type {ReduxModule} from '@wtg/redux-modules';

type Modules = Array<ReduxModule<*, *, *>> | ReduxModule<*, *, *>;
type Selector = (state: Object) => Object;

// Sugar and validation over `connectComponent`.
export default function connect(
  selector: Selector | Modules,
  modules?: Modules,
) {
  if (!modules) {
    invariant(typeof selector === 'object', 'Expected Redux modules.');
    modules = castArray(selector);
    selector = createImplicitSelector(modules);
  }
  invariant(typeof selector === 'function', 'Expected selector.');
  return connectComponent(selector, castArray(modules));
}
