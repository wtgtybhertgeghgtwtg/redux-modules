// @flow
import {isFSA} from 'flux-standard-action';
import {forEach} from 'lodash';

import type {
  ActionCreator,
  ExtractActionCreatorType,
  ModuleEnhancer,
  ReduxModule,
} from '../src/types';

type Options<S: Object, C: {}> = {
  initialState: S,
  name: string,
  transformations: C,
};

// Create a test harness.  It's annoying to copypaste it between `createModule` and `createModuleNormalized`.
export default function createHarness(
  creatorFunction: <S: Object, C: {}>(
    options: Options<any, any>,
    enhancer?: ModuleEnhancer<any, any>,
  ) => ReduxModule<S, C>,
) {
  return function harness<S: Object, C: {}>(
    options: Options<S, C>,
    enhancer?: ModuleEnhancer<any, any>,
  ): ReduxModule<S, $ObjMap<C, ExtractActionCreatorType>> {
    const {initialState, name, transformations} = options;
    const transformationKeys = transformations
      ? Object.keys(transformations)
      : [];
    const testModule = creatorFunction(options, enhancer);

    it('passes `name` as `name`.', () => {
      expect(testModule.name).toEqual(name);
    });

    it('creates an action creator for each transformation.', () => {
      expect(Object.keys(testModule.actionCreators)).toEqual(
        transformationKeys,
      );
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
        const testState = {...initialState, aPropNotInInitialState: 0};
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
  };
}
