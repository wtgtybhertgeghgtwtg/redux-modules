// @flow
import type {Reducer} from 'redux';

import type {Action, ReducerMap} from './types';

export default function createReducer<S>(
  reducerMap: ReducerMap<S>,
  initialState: S,
): Reducer<S, *> {
  return function reducer(state: S = initialState, action: Action<*, *>): S {
    const localReducer = reducerMap.get(action.type);
    return localReducer ? localReducer(state, action) : state;
  };
}
