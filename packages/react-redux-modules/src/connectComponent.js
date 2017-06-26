// @flow
import {map} from 'lodash';
import PropTypes from 'prop-types';
import {Component, createElement} from 'react';
import {bindActionCreators, type Dispatch} from 'redux';
import {connect as reactReduxConnect, type MapStateToProps} from 'react-redux';

import type {Action, ReduxModule} from '@wtg/redux-modules';

export default function connectComponent<S: Object, OP: Object, SP: Object>(
  selector: MapStateToProps<S, OP, SP>,
  modules: Array<ReduxModule<*, *, *>>,
) {
  const actionCreators = Object.assign({}, ...map(modules, 'actionCreators'));
  const mapDispatchToProps = (dispatch: Dispatch<Action<*, *>>) =>
    bindActionCreators(actionCreators, dispatch);
  const reactReduxConnectComponent = reactReduxConnect(
    selector,
    mapDispatchToProps,
  );
  return (NestedComponent: Class<React$Component<void, OP, void>>) => {
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
        return createElement(NestedComponent, this.props);
      }
    }

    return reactReduxConnectComponent(Connect);
  };
}
