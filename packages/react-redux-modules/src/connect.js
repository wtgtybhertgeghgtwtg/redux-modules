// @flow
// TODO: Write definitions for `arrify`.
import arrify from 'arrify';
import invariant from 'invariant';

import connectComponent from './connectComponent';
import createImplicitSelector from './createImplicitSelector';

import type {ReduxModule} from 'types/redux-modules';

type Modules = Array<ReduxModule<*, *>> | ReduxModule<*, *>;
type Selector = (state: Object) => Object;

// Sugar and validation over `connectComponent`.
export default function connect(selector: Selector | Modules, modules?: Modules) {
  if (!modules) {
    invariant(typeof selector === 'object', 'Expected Redux modules.');
    modules = arrify(selector);
    selector = createImplicitSelector(modules);
  }
  invariant(typeof selector === 'function', 'Expected selector.');
  return connectComponent(selector, arrify(modules));
}
