// @flow
import type {
  Action,
  ActionCreator,
  ExtractActionCreatorType,
  ExtractTypeType,
  NormalizedCreateModuleOptions,
  Transformations,
} from '@wtg/redux-modules';
import {isFSA} from 'flux-standard-action';
import {forEach} from 'lodash';
import {take, put} from 'redux-saga/effects';

import moduleCreator from '../src/moduleCreator';
import type {ReduxModule, SagaCreatorProps} from '../src/types';

jest.mock('@wtg/redux-modules');

function harness<S: Object, C: Transformations<S>>(
  options: NormalizedCreateModuleOptions<S, C>,
): ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
> {
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

describe('moduleCreator({initialState, name, transformations})', () => {
  const name = 'test';
  const initialState = {
    color: 'red',
    isWaiting: false,
  };
  const transformations = {
    setColor: {
      reducer: (state, {payload}: Action<string, void>) => ({
        ...state,
        color: payload,
        isWaiting: false,
      }),
    },
    setColorEventually: {
      reducer: state => ({...state, isWaiting: true}),
      sagaCreator: ({
        actionCreators,
        types,
      }: SagaCreatorProps<*, *, *, typeof testModule>) =>
        function*() {
          const {payload} = yield take(types.setColorEventually);
          yield put(actionCreators.setColor(payload));
        },
    },
  };
  const testModule = harness({initialState, name, transformations});
  it('creates a proper saga.', () => {
    const gen = testModule.sagas.setColorEventually();
    expect(gen.next().value).toEqual(take(testModule.types.setColorEventually));
    expect(
      gen.next(testModule.actionCreators.setColorEventually('green')).value,
    ).toEqual(put(testModule.actionCreators.setColor('green')));
  });
});
