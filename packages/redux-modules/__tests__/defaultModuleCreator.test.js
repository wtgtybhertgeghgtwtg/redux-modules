// @flow
import {isFSA} from 'flux-standard-action';
import {forEach} from 'lodash';

import defaultModuleCreator from '../src/defaultModuleCreator';
import type {
  Action,
  ActionCreator,
  ExtractActionCreatorType,
  ExtractTypeType,
  NormalizedCreateModuleOptions,
  ReduxModule,
  Transformations,
} from '../src/types';

// eslint-disable-next-line require-jsdoc
function harness<S: Object, C: Transformations<S>>(
  options: NormalizedCreateModuleOptions<S, C>,
): ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
> {
  const {initialState, name, transformations} = options;
  const transformationKeys = Object.keys(transformations);
  const testModule = defaultModuleCreator(options);

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

describe('defaultModuleCreator({initialState, name, transformations})', () => {
  afterEach(() => jest.clearAllMocks());

  type State = {
    propOne: number,
    propThree: ?boolean,
    propTwo: string,
  };

  const name = 'test';
  const initialState = {
    propOne: 1,
    propThree: false,
    propTwo: 'two',
  };
  const bumpPropOneReducer = jest.fn((state: State) => ({
    ...state,
    propOne: state.propOne + 1,
  }));
  const setPropThreeReducer = jest.fn(
    (state: State, action: Action<void, boolean>) => ({
      ...state,
      propThree: action.meta,
    }),
  );
  const setPropTwoReducer = jest.fn((state: State, action: Action<string>) => ({
    ...state,
    propTwo: action.payload,
  }));
  const transformations = {
    bumpPropOne: {
      reducer: bumpPropOneReducer,
    },
    setPropThree: {
      reducer: setPropThreeReducer,
    },
    setPropTwo: {
      reducer: setPropTwoReducer,
    },
  };
  const testModule = harness({initialState, name, transformations});

  describe('a transformation that takes only `state`.', () => {
    const testAction = testModule.actionCreators.bumpPropOne();

    it('transforms `state`.', () => {
      const testState: State = {
        propOne: 2,
        propThree: null,
        propTwo: 'three',
      };
      const expectedState = {
        ...testState,
        propOne: testState.propOne + 1,
      };
      const resultState = testModule.reducer(testState, testAction);
      expect(resultState).toEqual(expectedState);
      expect(bumpPropOneReducer).toHaveBeenCalledWith(testState, testAction);
    });

    it('uses `initialState` if `state` is undefined.', () => {
      const expectedState = {
        ...initialState,
        propOne: initialState.propOne + 1,
      };
      // $FlowFixMe
      const resultState = testModule.reducer(undefined, testAction);
      expect(resultState).toEqual(expectedState);
      expect(bumpPropOneReducer).toHaveBeenCalledWith(initialState, testAction);
    });
  });

  describe('a transformation that takes `payload`.', () => {
    const testAction = testModule.actionCreators.setPropTwo('four');

    it('transforms `state`.', () => {
      const testState: State = {
        propOne: 2,
        propThree: null,
        propTwo: 'three',
      };
      const expectedState = {
        ...testState,
        propTwo: testAction.payload,
      };
      const resultState = testModule.reducer(testState, testAction);
      expect(resultState).toEqual(expectedState);
      expect(setPropTwoReducer).toHaveBeenCalledWith(testState, testAction);
    });

    it('uses `initialState` if `state` is undefined.', () => {
      const expectedState = {
        ...initialState,
        propTwo: testAction.payload,
      };
      // $FlowFixMe
      const resultState = testModule.reducer(undefined, testAction);
      expect(resultState).toEqual(expectedState);
      expect(setPropTwoReducer).toHaveBeenCalledWith(initialState, testAction);
    });
  });

  describe('a transformation that takes `meta`.', () => {
    const testAction = testModule.actionCreators.setPropThree(undefined, true);

    it('transforms `state`.', () => {
      const testState: State = {
        propOne: 2,
        propThree: null,
        propTwo: 'three',
      };
      const expectedState = {
        ...testState,
        propThree: testAction.meta,
      };
      const resultState = testModule.reducer(testState, testAction);
      expect(resultState).toEqual(expectedState);
      expect(setPropThreeReducer).toHaveBeenCalledWith(testState, testAction);
    });

    it('uses `initialState` if `state` is undefined.', () => {
      const expectedState = {
        ...initialState,
        propThree: testAction.meta,
      };
      // $FlowFixMe
      const resultState = testModule.reducer(undefined, testAction);
      expect(resultState).toEqual(expectedState);
      expect(setPropThreeReducer).toHaveBeenCalledWith(
        initialState,
        testAction,
      );
    });
  });
});
