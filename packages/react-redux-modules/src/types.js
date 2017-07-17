// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import type {ConnectOptions as ReactReduxConnectOptions} from 'react-redux';

export type ConnectOptions = {
  ...ReactReduxConnectOptions,
  connectWrapper: any => Class<React$Component<*, *, *>>,
};

export type RegisterModules = (modules: Array<ReduxModule<*, *, *>>) => void;
