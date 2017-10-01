// @flow
import type {ActionCreator, ReduxModule} from '@wtg/redux-modules';
import {mapValues} from 'lodash';

export type ActionCreatorWrapper = <P, M>(
  actionCreator: ActionCreator<P, M>,
  name: string,
) => ActionCreator<P, M>;

/**
 * Wraps the actionCreators of a module with a function and returns a new module.
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
 * // Wrap the actionCreators.  Here using `jest.fn`.
 * const wrapped = wrapActionCreators(counterModule, jest.fn);
 * wrapped.actionCreators.incrementBy(4);
 * // Passes, since `incrementBy` has been wrapped with `jest.fn`.
 * expect(wrapped.actionCreators.incrementBy).toHaveBeenCalledWith(4);
 * @example
 * @param {ReduxModule} reduxModule The module whose actionCreators will be bound.
 * @param {ActionCreatorWrapper} wrapper The wrapper function.
 * @return {ReduxModule} The module with its actionCreators bound.
 */
export default function wrapActionCreators<
  S: Object,
  A: {[name: string]: ActionCreator<any, any>},
>(
  reduxModule: ReduxModule<S, A>,
  wrapper: ActionCreatorWrapper,
): ReduxModule<S, A> {
  // $FlowFixMe `mapValues` doesn't preserve type information.
  const boundActionCreators: A = mapValues(reduxModule.actionCreators, wrapper);
  return {
    ...reduxModule,
    actionCreators: boundActionCreators,
  };
}
