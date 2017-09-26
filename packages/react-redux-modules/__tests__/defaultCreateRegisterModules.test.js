// @flow
import {identity} from 'lodash';
import {createStore} from 'redux';

import createModule, {type Action} from '../../redux-modules/src';
import defaultCreateRegisterModules from '../src/defaultCreateRegisterModules';

describe('defaultCreateRegisterModules', () => {
  /**
   * @private
   * Create a store with mocked functions.
   * @return {Store}  The mocked store.
   */
  function createMockStore() {
    const store = createStore(identity);
    return {
      ...store,
      replaceReducer: jest.fn(store.replaceReducer),
    };
  }

  const moduleOneInitialState = {};
  const moduleTwoInitialState = {
    propOne: 0,
    propTwo: 'two',
  };
  const moduleThreeInitialState = {
    propThree: false,
    propTwo: 'two',
  };

  const moduleOne = createModule({
    initialState: moduleOneInitialState,
    name: 'moduleOne',
  });
  const moduleTwo = createModule({
    initialState: moduleTwoInitialState,
    name: 'moduleTwo',
    transformations: {
      bumpPropOne: state => ({...state, propOne: state.propOne + 1}),
      setPropTwo: (state, action: Action<string>) => ({
        ...state,
        propTwo: state.propTwo,
      }),
    },
  });
  const moduleThree = createModule({
    initialState: moduleThreeInitialState,
    name: 'moduleThree',
    transformations: {
      setPropThree: (state, action: Action<void, boolean>) => ({
        ...state,
        propThree: action.meta,
      }),
      setPropTwo: (state, action: Action<string>) => ({
        ...state,
        propTwo: state.propTwo,
      }),
    },
  });

  describe('basic registration', () => {
    const store = createMockStore();
    const registerModules = defaultCreateRegisterModules(store);
    expect(store.replaceReducer).not.toHaveBeenCalled();

    it('registers a single module.', () => {
      registerModules([moduleOne]);
      expect(store.replaceReducer).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual({
        moduleOne: moduleOneInitialState,
      });
    });

    it('will not replace the reducer if a module that has already been registered is given.', () => {
      // Registering the same module won't trigger a replacement.
      registerModules([moduleOne]);
      expect(store.replaceReducer).toHaveBeenCalledTimes(1);
      expect(store.getState()).toEqual({
        moduleOne: moduleOneInitialState,
      });
    });

    it('registers multiple modules.', () => {
      registerModules([moduleTwo, moduleThree]);
      // Only replaces once.
      expect(store.replaceReducer).toHaveBeenCalledTimes(2);
      expect(store.getState()).toEqual({
        moduleOne: moduleOneInitialState,
        moduleThree: moduleThreeInitialState,
        moduleTwo: moduleTwoInitialState,
      });
    });
  });

  describe('preregistering reducers', () => {
    const store = createMockStore();
    const registerModules = defaultCreateRegisterModules(store, {
      moduleOne: moduleOne.reducer,
    });
    expect(store.replaceReducer).not.toHaveBeenCalled();

    it('will not reregister a preregistered module.', () => {
      registerModules([moduleOne]);
      expect(store.replaceReducer).not.toHaveBeenCalled();
    });
  });
});
