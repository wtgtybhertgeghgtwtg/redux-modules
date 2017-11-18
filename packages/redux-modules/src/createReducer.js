// @flow
import type {Reducer} from 'redux';

import type {Action, ReducerMap} from './types';

/**
 * @private
 * Creates a Reducer for the given ReducerMap.
 * @param {ReducerMap} reducerMap The ReducerMap that the Reducer will reference.
 * @param {State} initialState The initialState of the Reducer.
 * @return {Reducer} The created Reducer.
 */
export default function createReducer<State: Object>(
  reducerMap: ReducerMap<State>,
  initialState: State,
): Reducer<State, *> {
  return function reducer(
    state: State = initialState,
    action: Action<any, any>,
  ): State {
    const localReducer = reducerMap.get(action.type);
    return localReducer ? localReducer(state, action) : state;
  };
}
