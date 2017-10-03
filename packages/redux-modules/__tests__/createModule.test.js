// @flow
import createHarness from './createHarness';
import createModule from '../src/createModule';
import type {
  Action,
  ModuleCreator,
  ModuleEnhancer,
  NormalizedCreateModuleOptions,
} from '../src/types';

const harness = createHarness(createModule);

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
    (createModule: ModuleCreator<any, any>) => <S: Object, C: {}>(
      options: NormalizedCreateModuleOptions<S, C>,
      enhancer?: ModuleEnhancer<S, C>,
    ) => {
      const reduxModule = createModule(options, enhancer);
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
    // $FlowFixMe
    harness({initialState, name});
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
