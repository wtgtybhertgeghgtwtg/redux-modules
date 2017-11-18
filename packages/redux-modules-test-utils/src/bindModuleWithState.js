// @flow
import type {ActionCreator, ReduxModule} from '@wtg/redux-modules';
import {mapValues} from 'lodash';

type ExtractBoundActionCreatorWithState<State> = <Payload, Meta>(
  ActionCreator<Payload, Meta>,
) => (payload: Payload, meta: Meta) => State;

/**
 * Binds the actionCreators of a module to its reducer with a given state for easier testing.
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
 * const boundCounterModule = bindModule(counterModule, { count: 3 });
 * // Creates an `increment` action and runs it through the reducer with the given state.  Returns `{ count: 4 }`.
 * boundCounterModule.increment();
 * // Creates an `incrementBy` action and runs it through the reducer with the given state.  Returns `{ count: 5 }`.
 * boundCounterModule.incrementBy(2);
 * @example
 * @param {ReduxModule} reduxModule The module to bind.
 * @param {State} state The state to bind.
 * @return {BoundModule} The bound module.
 */
export default function bindModuleWithState<
  State: Object,
  AMap: {[transformationName: string]: ActionCreator<any, any>},
>(
  reduxModule: ReduxModule<State, AMap>,
  state: State,
): $ObjMap<AMap, ExtractBoundActionCreatorWithState<State>> {
  const {actionCreators, reducer} = reduxModule;
  // Yep, gotta append everything with "WithState".
  const bindActionCreatorWithState = <Payload, Meta>(
    actionCreator: ActionCreator<Payload, Meta>,
  ) => (payload: Payload, meta: Meta) =>
    reducer(state, actionCreator(payload, meta));
  return mapValues(actionCreators, bindActionCreatorWithState);
}
