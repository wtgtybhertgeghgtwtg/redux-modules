// @flow
import createHarness from './createHarness';
import createModuleNormalized from '../src/createModuleNormalized';
import type {Action} from '../src/types';

const harness = createHarness(createModuleNormalized);

describe('defaultModuleCreator({initialState, name, transformations})', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  type State = {
    propOne: number,
    propThree: ?boolean,
    propTwo: string,
  };

  const name = 'test';
  const initialState: State = {
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
