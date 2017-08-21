// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import PropTypes from 'prop-types';
import {Component, createElement} from 'react';
import {connect as reactReduxConnect, type MapStateToProps} from 'react-redux';

import defaultMapModulesToProps from './defaultMapModulesToProps';
import type {ConnectOptions, RegisterModules} from './types';

/**
 * @private
 * Creates a higher-order component that connects a React component to an array of modules.
 * @param {Selector} selector A selector function that will determine which part of the state will be passed to the component.
 * @param {Array<ReduxModule>} modules Modules whose actionCreators will be passed as props to the component.  If there are no associated reducers in the Redux store, they will be automatically registered.
 * @param {ConnectOptions} options The options object from `react-redux`.
 * @return {Connector} A connector higher-order component.
 */
export default function connectComponent<
  S: Object,
  OP: Object,
  SP: Object,
  DP: Object,
>(
  selector: MapStateToProps<S, OP, SP>,
  modules: Array<ReduxModule<Object, Object, Object>>,
  options: ConnectOptions,
) {
  const {connectWrapper, ...reactReduxOptions} = options;
  const mapDispatchToProps = defaultMapModulesToProps(modules);
  const reactReduxConnectComponent = reactReduxConnect(
    selector,
    mapDispatchToProps,
    null,
    reactReduxOptions,
  );
  return (component: React$ComponentType<$Supertype<OP & SP & DP>>) => {
    const connectedComponent = connectWrapper(
      reactReduxConnectComponent(component),
    );
    return class Connect extends Component<OP> {
      static contextTypes = {
        registerModules: PropTypes.func,
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
        return createElement(connectedComponent, this.props || {});
      }
    };
  };
}
