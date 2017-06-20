// @flow
import {mapValues} from 'lodash';

import type {Reducer} from 'redux';

import type {Action, ActionCreator, ReduxModule, Transformations} from '@wtg/redux-modules';

export type BoundModule<S, T> = $ObjMap<T, ExtractBoundModule<S>>

type ExtractBoundModule<S> = <P, M>(Reducer<*, Action<P, M>>) => (state: S, payload?: P, meta?: M) => S;

export default function bindModule<S: Object, T: Transformations<S>>(reduxModule: ReduxModule<S, T>): BoundModule<S, T> {
  const {actionCreators, reducer} = reduxModule;
  function bindActionCreator<P, M>(actionCreator: ActionCreator<P, M>) {
    return (state: S, payload?: P, meta?: M) => reducer(state, actionCreator(payload, meta));
  }
  return mapValues(actionCreators, bindActionCreator);
}
