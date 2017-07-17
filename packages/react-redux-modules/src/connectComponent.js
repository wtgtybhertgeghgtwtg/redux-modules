// @flow
import type {Action, ReduxModule} from '@wtg/redux-modules';
import {map} from 'lodash';
import PropTypes from 'prop-types';
import {Component, createElement} from 'react';
import {bindActionCreators, type Dispatch} from 'redux';
import {
  connect as reactReduxConnect,
  type MapStateToProps,
  type StatelessComponent,
} from 'react-redux';

import type {ConnectOptions, RegisterModules} from './types';

export default function connectComponent<S: Object, OP: Object, SP: Object>(
  selector: MapStateToProps<S, OP, SP>,
  modules: Array<ReduxModule<Object, any, any>>,
  options: ConnectOptions,
) {
  const {connectWrapper, ...reactReduxOptions} = options;
  const actionCreators = Object.assign({}, ...map(modules, 'actionCreators'));
  type DP = typeof actionCreators;
  type P = $Supertype<OP & SP & DP>;
  const mapDispatchToProps = (dispatch: Dispatch<Action<any, any>>) =>
    bindActionCreators(actionCreators, dispatch);
  const reactReduxConnectComponent = reactReduxConnect(
    selector,
    mapDispatchToProps,
    null,
    reactReduxOptions,
  );
  return <Def, St>(
    component: StatelessComponent<P> | Class<React$Component<Def, P, St>>,
  ) => {
    const connectedComponent = connectWrapper(
      reactReduxConnectComponent(component),
    );
    return class Connect extends Component {
      static contextTypes = {
        registerModules: PropTypes.func,
      };

      constructor(
        props: any,
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
        return createElement(connectedComponent, this.props);
      }
    };
  };
}
