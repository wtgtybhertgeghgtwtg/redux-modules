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

/**
 * Creates a higher-order component that connects a React component to one or more ReduxModules.  The actionCreators and assosciated state of the modules will be passed as props to the component.
 * @example
 * // Connects a module to a component.  The state selected by `exampleSelector` and the actionCreators of `exampleModule` will be passed as props to `ExampleComponent`.
 * connect(exampleSelector, exampleModule)(ExampleComponent);
 * // Connects a module to a component without an explicit selector.  The selector is infered to be `state => state[exampleModule.name]`.
 * connect(exampleModule)(ExampleComponent);
 * // Connects multiple modules to a component, again without an explicit selector.  The selector is infered to be `state => ({...state[exampleModule.name], ...state[otherExampleModule.name]]})`.
 * connect([exampleModule, otherExampleModule])(ExampleComponent);
 * @example
 * @param {Selector|ReduxModule|Array<ReduxModule>} selector A selector function that will determine which part of the state will be passed to the component.
 * @param {ReduxModule|Array<ReduxModule>} modules A module or modules whose actionCreators will be passed as props to the component.  If there is not an associated reducer in the Redux store, it will be automatically registered.
 * @param {ConnectOptions} options The options object from `react-redux`.
 * @return {Connector} A connector higher-order component.
 */
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
