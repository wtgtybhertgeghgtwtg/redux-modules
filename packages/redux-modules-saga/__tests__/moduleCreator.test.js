// @flow
import type {
  ActionCreator,
  ExtractActionCreatorType,
  NormalizedCreateModuleOptions,
  SuperTransformations,
} from '@wtg/redux-modules';
import {isFSA} from 'flux-standard-action';
import {forEach} from 'lodash';

import moduleCreator from '../src/moduleCreator';
import type {Transformation} from '../src/types';

jest.mock('@wtg/redux-modules');

function harness<
  S: Object,
  T: Transformation<S, *, *, *>,
  C: SuperTransformations<S, T>,
>(options: NormalizedCreateModuleOptions<S, T, C>) {
  const {initialState, name, transformations} = options;
  const transformationKeys = Object.keys(transformations);
  const testModule = moduleCreator(options);

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
    // it('transforms `state` for appropriate actions.', () => {
    //
    // });

    it('returns `state` unchanged with unknown types.', () => {
      const testAction = {
        type: 'This does not match anything.',
      };
      const testState = {...initialState};
      const resultState = testModule.reducer(testState, testAction);
      expect(resultState).toEqual(testState);
    });
  });
}

describe('moduleCreator({initialState, name, transformations})', () => {
  const name = 'test';
  const initialState = {
    propOne: 1,
    propTwo: 'two',
  };
  const transformations = {
    bumpPropOne: {
      reducer: state => ({...state, propOne: state.propOne + 1}),
    },
    setPropTwo: {
      reducer: (state, action) => ({...state, propTwo: action.payload}),
      sagaCreator: (
        actionCreators: $ObjMap<
          typeof transformations,
          ExtractActionCreatorType,
        >,
      ) => function*() {},
    },
  };
  harness({initialState, name, transformations});
});
