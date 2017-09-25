// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import hoistNonReactStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';
import {Component, type ComponentType, createElement} from 'react';
import {
  connect as reactReduxConnect,
  type Connector,
  type MapStateToProps,
} from 'react-redux';

import type {ConnectOptions, MapModulesToProps, RegisterModules} from './types';

/**
 * @private
 * Creates a higher-order component that connects a React component to an array of modules.
 * @param {Selector} selector A selector function that will determine which part of the state will be passed to the component.
 * @param {Array<ReduxModule>} modules Modules whose actionCreators will be passed as props to the component.  If there are no associated reducers in the Redux store, they will be automatically registered.
 * @param {MapModulesToProps} mapModulesToProps A function that will determine how modules are mapped to props.
 * @param {ConnectOptions} options The options object from `react-redux`.
 * @return {Connector} A connector higher-order component.
 */
export default function connectComponent<
  S: Object,
  OP: {},
  SP: Object,
  DP: Object,
>(
  selector: MapStateToProps<S, OP, SP>,
  modules: Array<ReduxModule<Object, *>>,
  mapModulesToProps: MapModulesToProps<*, OP, DP>,
  options: ConnectOptions,
): Connector<OP, $Supertype<OP & SP & DP>> {
  const {connectWrapper, ...reactReduxOptions} = options;
  const mapDispatchToProps = mapModulesToProps(modules);
  const reactReduxConnectComponent = reactReduxConnect(
    selector,
    mapDispatchToProps,
    null,
    reactReduxOptions,
  );
  type Props = $Supertype<OP & SP & DP>;
  return (component: ComponentType<Props>) => {
    const baseConnectedComponent: ComponentType<
      Props,
    > = reactReduxConnectComponent(component);
    const connectedComponent = connectWrapper(baseConnectedComponent);
    /**
     * @private
     * The connected component.  Accesses the store from a parent `Provider` component.
     */
    class Connect extends Component<OP> {
      static contextTypes = {
        registerModules: PropTypes.func,
        store: PropTypes.object,
      };

      constructor(
        props: OP,
        context: {
          registerModules?: RegisterModules,
        },
      ) {
        super(props, context);
        if (context.registerModules) {
          context.registerModules(modules);
        }
      }

      render() {
        return createElement(connectedComponent, {...this.props});
      }
    }
    return hoistNonReactStatics(Connect, connectedComponent);
  };
}
