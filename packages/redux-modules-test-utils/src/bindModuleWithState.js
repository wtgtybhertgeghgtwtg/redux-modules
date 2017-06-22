// @flow
import type {
  ActionCreator,
  ActionCreators,
  ReduxModule,
} from '@wtg/redux-modules';
import {mapValues} from 'lodash';

export type BoundModuleWithState<S, A> = $ObjMap<
  A,
  ExtractBoundModuleWithState<S>,
>;

type ExtractBoundModuleWithState<S> = <P, M>(
  ActionCreator<P, M>,
) => (payload?: P, meta?: M) => S;

export default function bindModuleWithState<S: Object, A: ActionCreators>(
  reduxModule: ReduxModule<S, A, *>,
  state: S,
): BoundModuleWithState<S, A> {
  const {actionCreators, reducer} = reduxModule;
  // Yep, gotta append everything with "WithState".
  function bindActionCreatorWithState<P, M>(
    actionCreator: ActionCreator<P, M>,
  ) {
    return (payload?: P, meta?: M) =>
      reducer(state, actionCreator(payload, meta));
  }
  return mapValues(actionCreators, bindActionCreatorWithState);
}
