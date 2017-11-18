// @flow
import type {ActionCreator, ReduxModule} from '@wtg/redux-modules';
import {mapValues} from 'lodash';

type ExtractBoundActionCreator<State> = <Payload, Meta>(
  ActionCreator<Payload, Meta>,
) => (state: State, payload: Payload, meta: Meta) => State;

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
export default function bindModule<
  State: Object,
  AMap: {[transformationName: string]: ActionCreator<any, any>},
>(
  reduxModule: ReduxModule<State, AMap>,
): $ObjMap<AMap, ExtractBoundActionCreator<State>> {
  const {actionCreators, reducer} = reduxModule;
  const bindActionCreator = <Payload, Meta>(
    actionCreator: ActionCreator<Payload, Meta>,
  ) => (state: State, payload: Payload, meta: Meta) =>
    reducer(state, actionCreator(payload, meta));
  return mapValues(actionCreators, bindActionCreator);
}
