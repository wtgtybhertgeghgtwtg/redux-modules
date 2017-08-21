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

/**
 * Binds the actionCreators of a module to its reducer for easier testing.
 * @example
 * // Create a module.
 * const counterModule = createModule({
 *   initialState: {
 *     count: 0,
 *   },
 *   name: 'counter',
 *   transformations: {
 *     increment: state => ({...state, count: state.count + 1}),
 *     incrementBy: (state, action) => ({...state, count: state.count + action.payload}),
 *   },
 * });
 * // Bind the module.
 * const boundCounterModule = bindModule(counterModule);
 * // Creates an `increment` action and runs it through the reducer with the given state.  Returns `{ count: 4 }`.
 * boundCounterModule.increment({ count: 3 });
 * // Creates an `incrementBy` action and runs it through the reducer with the given state.  Returns `{ count: 5 }`.
 * boundCounterModule.incrementBy({ count: 3 }, 2);
 * @example
 * @param {ReduxModule} reduxModule The module to bind.
 * @return {BoundModule} The bound module.
 */
export default function bindModule<S: Object, A: ActionCreators>(
  reduxModule: ReduxModule<S, A>,
): BoundModule<S, A> {
  const {actionCreators, reducer} = reduxModule;
  const bindActionCreator = <P, M>(actionCreator: ActionCreator<P, M>) => (
    state: S,
    payload: P,
    meta: M,
  ) => reducer(state, actionCreator(payload, meta));
  return mapValues(actionCreators, bindActionCreator);
}
