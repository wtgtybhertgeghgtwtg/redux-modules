// @flow
import {isFSA} from 'flux-standard-action';
import {forEach} from 'lodash';

import createModule from '../src/createModule';
import type {
  Action,
  ActionCreator,
  CreateModuleOptions,
  ExtractActionCreatorType,
  ModuleCreator,
  ModuleEnhancer,
  ReduxModule,
} from '../src/types';

function harness<State: Object, IMap: {}>(
  options: CreateModuleOptions<State, IMap>,
  enhancer?: ModuleEnhancer<any, any>,
): ReduxModule<State, $ObjMap<IMap, ExtractActionCreatorType>> {
  const {initialState, name, transformations} = options;
  const transformationKeys = transformations
    ? Object.keys(transformations)
    : [];
  const testModule = createModule(options, enhancer);

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
}

describe('createModule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  type State = {
    propOne: number,
    propThree: Array<string>,
    propTwo: string,
  };

  const name = 'test';
  const initialState: State = {
    propOne: 1,
    propThree: ['three'],
    propTwo: 'two',
  };
  const bumpPropOneReducer = jest.fn((state: State) => ({
    ...state,
    propOne: state.propOne + 1,
  }));
  const mergePropThreeReducer = jest.fn(
    (state: State, action: Action<void, Array<string>>) => ({
      ...state,
      propThree: [...state.propThree, ...action.meta],
    }),
  );
  const setPropTwoReducer = jest.fn((state: State, action: Action<string>) => ({
    ...state,
    propTwo: action.payload,
  }));
  const transformations = {
    bumpPropOne: bumpPropOneReducer,
    mergePropThree: mergePropThreeReducer,
    setPropTwo: {
      reducer: setPropTwoReducer,
    },
  };
  const testEnhancer = jest.fn(
    (next: ModuleCreator<any, any>) => <State: Object, IMap: {}>(
      options: CreateModuleOptions<State, IMap>,
      enhancer?: ModuleEnhancer<State, IMap>,
    ) => {
      const reduxModule = next(options, enhancer);
      return {
        ...reduxModule,
        someCustomProp: 'custom',
      };
    },
  );

  describe('createModule({})', () => {
    it('throws.', () => {
      // $FlowFixMe
      expect(() => harness({})).toThrow();
    });
  });

  describe('createModule({name})', () => {
    it('throws.', () => {
      // $FlowFixMe
      expect(() => harness({name})).toThrow();
    });
  });

  describe('createModule({initialState, name})', () => {
    const testModule = harness({initialState, name});
    it('still defines all properties.', () => {
      expect(testModule.actionCreators).toBeDefined();
      expect(testModule.types).toBeDefined();
    });
  });

  describe('createModule({initialState, name, transformations})', () => {
    const testModule = harness({initialState, name, transformations});

    describe('a transformation that takes only `state`.', () => {
      const testAction = testModule.actionCreators.bumpPropOne();

      it('transforms `state`.', () => {
        const testState: State = {
          propOne: 2,
          propThree: ['four'],
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
        expect(bumpPropOneReducer).toHaveBeenCalledWith(
          initialState,
          testAction,
        );
      });
    });

    describe('a transformation that takes `payload`.', () => {
      const testAction = testModule.actionCreators.setPropTwo('four');

      it('transforms `state`.', () => {
        const testState: State = {
          propOne: 2,
          propThree: ['four'],
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
        expect(setPropTwoReducer).toHaveBeenCalledWith(
          initialState,
          testAction,
        );
      });
    });

    describe('a transformation that takes `meta`.', () => {
      const testAction = testModule.actionCreators.mergePropThree(undefined, [
        'five',
      ]);

      it('transforms `state`.', () => {
        const testState: State = {
          propOne: 2,
          propThree: ['four'],
          propTwo: 'three',
        };
        const expectedState = {
          ...testState,
          propThree: [...testState.propThree, ...testAction.meta],
        };
        const resultState = testModule.reducer(testState, testAction);
        expect(resultState).toEqual(expectedState);
        expect(mergePropThreeReducer).toHaveBeenCalledWith(
          testState,
          testAction,
        );
      });

      it('uses `initialState` if `state` is undefined.', () => {
        const expectedState = {
          ...initialState,
          propThree: [...initialState.propThree, ...testAction.meta],
        };
        // $FlowFixMe
        const resultState = testModule.reducer(undefined, testAction);
        expect(resultState).toEqual(expectedState);
        expect(mergePropThreeReducer).toHaveBeenCalledWith(
          initialState,
          testAction,
        );
      });
    });
  });

  describe('createModule({initialState, name, transformations}, enhancer)', () => {
    expect(testEnhancer).not.toHaveBeenCalled();
    harness({initialState, name, transformations}, testEnhancer);
    expect(testEnhancer).toHaveBeenCalled();
  });
});
