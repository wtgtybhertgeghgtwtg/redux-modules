// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import invariant from 'invariant';
import {castArray, identity} from 'lodash';
import type {MapStateToProps} from 'react-redux';

import connectComponent from './connectComponent';
import createImplicitSelector from './createImplicitSelector';
import defaultMapModulesToProps from './defaultMapModulesToProps';
import type {ConnectOptions, MapModulesToProps} from './types';

type Modules = ReduxModule<Object, *> | Array<ReduxModule<Object, *>>;

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
 * @param {ReduxModule|Array<ReduxModule>|MapModulesToProps} modules A module or modules whose actionCreators will be passed as props to the component.  If there is not an associated reducer in the Redux store, it will be automatically registered.
 * @param {MapModulesToProps|ConnectOptions} mapModulesToProps A function that will determine how modules are mapped to props.
 * @param {ConnectOptions} options The options object from `react-redux`.
 * @return {Connector} A connector higher-order component.
 */
export default function connect<S: Object>(
  selector: MapStateToProps<S, *, *> | Modules,
  modules?: null | Modules | MapModulesToProps<*, *, *>,
  mapModulesToProps?: null | MapModulesToProps<*, *, *> | ConnectOptions,
  options?: null | ConnectOptions,
) {
  if (typeof selector !== 'function') {
    invariant(
      !modules || typeof modules === 'function',
      // Yeah, that makes sense.
      'If `selector` is implicit, `modules` must be `mapModulesToProps`.',
    );
    invariant(
      !mapModulesToProps || typeof mapModulesToProps === 'object',
      'If `selector` is implicit, `mapModulesToProps` must be `options`.',
    );
    const implicitSelector = createImplicitSelector(castArray(selector));
    return connect(implicitSelector, selector, modules, mapModulesToProps);
  }
  invariant(
    !mapModulesToProps || typeof mapModulesToProps === 'function',
    '`mapModulesToProps` must be a function or null.',
  );
  return connectComponent(
    selector,
    castArray(modules),
    mapModulesToProps || defaultMapModulesToProps,
    {
      connectWrapper: identity,
      ...options,
    },
  );
}
