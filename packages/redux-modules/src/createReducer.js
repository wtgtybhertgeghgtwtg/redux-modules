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
export default function createReducer<S>(
  reducerMap: ReducerMap<S>,
  initialState: S,
): Reducer<S, *> {
  return function reducer(state: S = initialState, action: Action<*, *>): S {
    const localReducer = reducerMap.get(action.type);
    return localReducer ? localReducer(state, action) : state;
  };
}
