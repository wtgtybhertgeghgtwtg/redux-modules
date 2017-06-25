// @flow
import {isFSA} from 'flux-standard-action';
import {forEach} from 'lodash';

import createModule from '../src/createModule';
import type {
  ActionCreator,
  CreateModuleOptions,
  ExtractActionCreatorType,
  ExtractTypeType,
  ImplicitTransformations,
  ReduxModule,
  Transformation,
} from '../src/types';

function harness<
  S: Object,
  T: Transformation<S, *, *>,
  C: ImplicitTransformations<S, T>,
>(
  options: CreateModuleOptions<S, T, C>,
): ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
> {
  const {initialState, name, transformations} = options;
  const transformationKeys = transformations
    ? Object.keys(transformations)
    : [];
  const testModule = createModule(options);

  it('passes `name` as `name`.', () => {
    expect(testModule.name).toEqual(name);
  });

  it('creates an action creator for each transformation.', () => {
    expect(Object.keys(testModule.actionCreators)).toEqual(transformationKeys);
    forEach(
      testModule.actionCreators,
      (actionCreator: ActionCreator<*, *>, name: string) => {
        const action = actionCreator();
        expect(isFSA(action)).toBe(true);
        expect(testModule.types[name]).toEqual(action.type);
      },
    );
  });

  it('creates a type for each transformation.', () => {
    expect(Object.keys(testModule.types)).toEqual(transformationKeys);
  });

  it('creates a reducer.', () => {
    expect(typeof testModule.reducer).toEqual('function');
  });

  describe('the resultant reducer', () => {
    const fakeAction = {
      type: 'This does not match anything.',
    };

    it('returns `state` for unknown types.', () => {
      const testState = {...initialState, aPropNotInitialState: 0};
      const resultState = testModule.reducer(testState, fakeAction);
      expect(resultState).toEqual(testState);
    });

    it('uses `initialState` if `state` is undefined.', () => {
      // $FlowFixMe
      const resultState = testModule.reducer(undefined, fakeAction);
      expect(resultState).toEqual(initialState);
    });
  });

  return testModule;
}

describe('createModule without `name`.', () => {
  it('throws.', () => {
    // $FlowFixMe
    expect(() => harness({})).toThrow();
  });
});

describe('createModule without `initialState`', () => {
  it('throws.', () => {
    const name = 'test';
    // $FlowFixMe
    expect(() => harness({name})).toThrow();
  });
});

describe('createModule({initialState, name})', () => {
  const name = 'test';
  const initialState = {
    propOne: 1,
    propTwo: 'two',
  };
  harness({initialState, name});
});

describe('createModule({initialState, name, transformations})', () => {
  const name = 'test';
  const initialState = {
    propOne: 1,
    propTwo: 'two',
  };
  const transformations = {
    bumpPropOne: state => ({...state, propOne: state.propOne + 1}),
    setPropTwo: {
      reducer: (state, action) => ({...state, propTwo: action.payload}),
    },
  };
  harness({initialState, name, transformations});
});
