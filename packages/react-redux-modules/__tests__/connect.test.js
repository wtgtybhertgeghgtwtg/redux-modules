// @flow
import {identity} from 'lodash';
import type {MapStateToProps} from 'react-redux';

import connect from '../src/connect';
import type {ConnectOptions} from '../src/types';
import createModule, {type ReduxModule} from '../../redux-modules/src';

jest.mock('../src/connectComponent', () => {
  return jest.fn(
    <S, OP, SP>(
      selector: MapStateToProps<S, OP, SP>,
      modules: Array<ReduxModule<Object, any, any>>,
      options: ConnectOptions,
    ) => {
      expect(typeof selector).toEqual('function');
      expect(Array.isArray(modules)).toBe(true);
      expect(typeof options).toEqual('object');
      expect(typeof options.connectWrapper).toEqual('function');
    },
  );
});

describe('connect', () => {
  const dummyModuleOne = createModule({
    initialState: {},
    name: 'dummyOne',
  });
  const dummyModuleTwo = createModule({
    initialState: {},
    name: 'dummyTwo',
  });
  const options = {
    connectWrapper: identity,
  };
  const selector = state => state;
  describe('`connect(modules)`', () => {
    it('works with just one module.', () => {
      expect(() => connect(dummyModuleOne)).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() => connect([dummyModuleOne, dummyModuleTwo])).not.toThrow();
    });
  });

  describe('`connect(selector, modules)`', () => {
    it('works with just one module.', () => {
      expect(() => connect(selector, dummyModuleOne)).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() =>
        connect(selector, [dummyModuleOne, dummyModuleTwo]),
      ).not.toThrow();
    });
  });

  describe('connect(modules, options)', () => {
    it('works with just one module.', () => {
      expect(() => connect(dummyModuleOne, options)).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() =>
        connect([dummyModuleOne, dummyModuleTwo], options),
      ).not.toThrow();
    });
  });

  describe('connect(selector, modules, options)', () => {
    it('works with just one module.', () => {
      expect(() => connect(selector, dummyModuleOne, options)).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() =>
        connect(selector, [dummyModuleOne, dummyModuleTwo], options),
      ).not.toThrow();
    });
  });
});
