// @flow
import type {ReduxModule} from '@wtg/redux-modules';

export type RegisterModules = (modules: Array<ReduxModule<*, *, *>>) => void;
