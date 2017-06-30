// @flow
import {map} from 'lodash';
import PropTypes from 'prop-types';
import {Component, createElement} from 'react';
import {bindActionCreators, type Dispatch} from 'redux';
import {
  connect as reactReduxConnect,
  type MapStateToProps,
  type StatelessComponent,
} from 'react-redux';

import type {Action, ReduxModule} from '@wtg/redux-modules';

export default function connectComponent<S: Object, OP: Object, SP: Object>(
  selector: MapStateToProps<S, OP, SP>,
  modules: Array<ReduxModule<Object, any, any>>,
) {
  const actionCreators = Object.assign({}, ...map(modules, 'actionCreators'));
  type DP = typeof actionCreators;
  type P = $Supertype<OP & SP & DP>;
  const mapDispatchToProps = (dispatch: Dispatch<Action<any, any>>) =>
    bindActionCreators(actionCreators, dispatch);
  const reactReduxConnectComponent = reactReduxConnect(
    selector,
    mapDispatchToProps,
  );
  return <Def, St>(
    component: StatelessComponent<P> | Class<React$Component<Def, P, St>>,
  ) => {
    class Connect extends Component {
      static contextTypes = {
        registerModules: PropTypes.func,
      };

      constructor(props, context) {
        super(props, context);
        if (context.registerModules) {
          context.registerModules(modules);
        }
      }

      render() {
        return createElement(component, this.props);
      }
    }

    return reactReduxConnectComponent(Connect);
  };
}
