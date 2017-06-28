// @flow
import type {
  ActionCreator,
  ActionCreators,
  ReduxModule,
} from '@wtg/redux-modules';
import {mapValues} from 'lodash';

export type BoundModule<S, A> = $ObjMap<A, ExtractBoundModule<S>>;

type ExtractBoundModule<S> = <P, M>(
  ActionCreator<P, M>,
) => (state: S, payload?: P, meta?: M) => S;

export default function bindModule<S: Object, A: ActionCreators>(
  reduxModule: ReduxModule<S, A, *>,
): BoundModule<S, A> {
  const {actionCreators, reducer} = reduxModule;
  function bindActionCreator<P, M>(actionCreator: ActionCreator<P, M>) {
    return (state: S, payload: P, meta: M) =>
      reducer(state, actionCreator(payload, meta));
  }
  return mapValues(actionCreators, bindActionCreator);
}
