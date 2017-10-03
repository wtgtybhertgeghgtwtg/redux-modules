// @flow
import createReducer from '../src/createReducer';

import type {Action} from '../src/types';

describe('the reducer returned by `createReducer`', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  type State = {
    isInState?: boolean,
    propOne: number,
    propTwo: string,
  };
  const initialState: State = {
    propOne: 1,
    propTwo: 'two',
  };
  const bumpPropOne = jest.fn((state: State) => ({
    ...state,
    propOne: state.propOne + 1,
  }));
  const setPropTwo = jest.fn((state: State, {payload}: Action<string>) => ({
    ...state,
    propTwo: payload,
  }));
  const reducerMap = new Map([
    ['TEST/BUMP_PROP_ONE', bumpPropOne],
    ['TEST/SET_PROP_TWO', setPropTwo],
  ]);
  const reducer = createReducer(reducerMap, initialState);

  // The state that's gonna be passed to `reducer`.
  const inState = {
    isInState: true,
    propOne: 1,
    propTwo: 'two',
  };

  // An action whose `type` isn't a key of `reducerMap`.
  const fakeAction = {
    type: 'FAKE_TYPE',
  };

  it('returns `state` if the `type` of `action` does not match a key of `reducerMap`.', () => {
    const outState = reducer(inState, fakeAction);
    // None of the reducers in `reducerMap` have been called.
    reducerMap.forEach(func => {
      expect(func).not.toHaveBeenCalled();
    });
    expect(inState).toBe(outState);
  });

  it('is a reducer for transformations in `reducerMap`.', () => {
    reducerMap.forEach((func, type) => {
      const action = {
        type,
      };
      expect(func).not.toHaveBeenCalled();
      const outState = reducer(initialState, action);
      expect(func).toHaveBeenCalled();
      // Even if the state might be equal, they aren't the same object.
      expect(inState).not.toBe(outState);
    });
  });

  it('uses `initialState` for its initial state.', () => {
    // $FlowFixMe
    const outState = reducer(undefined, fakeAction);
    expect(outState).toBe(initialState);
  });
});
