// @flow
import {mapValues} from 'lodash';

import type {Reducer} from 'redux';

import type {Action, ActionCreator, ReduxModule, Transformations} from 'types/redux-modules';

export type BoundModuleWithState<S, T> = $ObjMap<T, ExtractBoundModuleWithState<S>>;

type ExtractBoundModuleWithState<S> = <P, M>(Reducer<*, Action<P, M>>) => (payload?: P, meta?: M) => S;

export default function bindModuleWithState<S: Object, T: Transformations<S>>(reduxModule: ReduxModule<S, T>, state: S): BoundModuleWithState<S, T> {
  const {actionCreators, reducer} = reduxModule;
  function bindActionCreator<P, M>(actionCreator: ActionCreator<P, M>) {
    return (payload?: P, meta?: M) => reducer(state, actionCreator(payload, meta));
  }
  return mapValues(actionCreators, bindActionCreator);
}
