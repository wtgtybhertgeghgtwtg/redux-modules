// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import invariant from 'invariant';
import {castArray, identity} from 'lodash';

import connectComponent from './connectComponent';
import createImplicitSelector from './createImplicitSelector';
import type {ConnectOptions} from './types';

type Modules = Array<ReduxModule<*, *, *>> | ReduxModule<*, *, *>;
type Selector =
  | ((state: Object) => Object)
  | ((state: Object, props: Object) => Object);

// Sugar and validation over `connectComponent`.
export default function connect(
  selector: Selector | Modules,
  modules?: Modules | ConnectOptions,
  options?: ConnectOptions,
) {
  // (selector, modules) | (selector | modules | options)
  if (typeof selector === 'function') {
    options = {connectWrapper: identity, ...options};
    modules = castArray(modules);
    // (modules) | (modules, options)
  } else {
    invariant(!Array.isArray(modules), '`options` must be a plain object.');
    options = {connectWrapper: identity, ...modules};
    modules = castArray(selector);
    selector = createImplicitSelector(modules);
  }
  return connectComponent(selector, modules, options);
}
