// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import type {
  ConnectOptions as ReactReduxConnectOptions,
  MapDispatchToProps,
} from 'react-redux';
import type {Reducer} from 'redux';

export type ConnectOptions = {
  ...ReactReduxConnectOptions,
  connectWrapper: any => Class<React$Component<*>>,
};

export type MapModulesToProps<A, OP: Object, DP: Object> = (
  modules: Array<ReduxModule<Object, *>>,
) => MapDispatchToProps<A, OP, DP>;

// This is the same name as something from `@wtg/redux-modules` but something different.
// Yeah, that won't cause trouble down the line.
export type ReducerMap = {
  [name: string]: Reducer<*, *>,
};

export type RegisterModules = (modules: Array<ReduxModule<*, *>>) => void;
