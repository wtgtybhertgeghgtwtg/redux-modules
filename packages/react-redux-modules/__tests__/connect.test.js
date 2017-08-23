// @flow
import {identity} from 'lodash';
import type {MapStateToProps} from 'react-redux';

import connect from '../src/connect';
import type {ConnectOptions, MapModulesToProps} from '../src/types';
import createModule, {type ReduxModule} from '../../redux-modules/src';

jest.mock('../src/connectComponent', () => {
  return jest.fn(
    <S, OP, SP, DP>(
      selector: MapStateToProps<S, OP, SP>,
      modules: Array<ReduxModule<Object, Object>>,
      mapModulesToProps: MapModulesToProps<*, OP, DP>,
      options: ConnectOptions,
    ) => {
      expect(typeof selector).toEqual('function');
      expect(Array.isArray(modules)).toBe(true);
      expect(typeof mapModulesToProps).toEqual('function');
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
  const mapModulesToProps = <A: Object>(modules: Array<ReduxModule<*, A>>) =>
    modules[0].actionCreators;
  const options = {
    connectWrapper: identity,
  };
  describe('`connect(modules)`', () => {
    it('works with just one module.', () => {
      connect(dummyModuleOne);
      expect(() => connect(dummyModuleOne)).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() => connect([dummyModuleOne, dummyModuleTwo])).not.toThrow();
    });
  });

  describe('`connect(selector, modules)`', () => {
    it('works with just one module.', () => {
      expect(() => connect(identity, dummyModuleOne)).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() =>
        connect(identity, [dummyModuleOne, dummyModuleTwo]),
      ).not.toThrow();
    });
  });

  describe('connect(modules, null, options)', () => {
    it('works with just one module.', () => {
      expect(() => connect(dummyModuleOne, null, options)).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() =>
        connect([dummyModuleOne, dummyModuleTwo], null, options),
      ).not.toThrow();
    });
  });

  describe('connect(modules, mapModulesToProps, options)', () => {
    it('works with just one module.', () => {
      expect(() =>
        connect(dummyModuleOne, mapModulesToProps, options),
      ).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() =>
        connect([dummyModuleOne, dummyModuleTwo], mapModulesToProps, options),
      ).not.toThrow();
    });
  });

  describe('connect(selector, modules, null, options)', () => {
    it('works with just one module.', () => {
      expect(() =>
        connect(identity, dummyModuleOne, null, options),
      ).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() =>
        connect(identity, [dummyModuleOne, dummyModuleTwo], null, options),
      ).not.toThrow();
    });
  });

  describe('connect(selector, modules, mapModulesToProps, options)', () => {
    it('works with just one module.', () => {
      expect(() =>
        connect(identity, dummyModuleOne, mapModulesToProps, options),
      ).not.toThrow();
    });
    it('works with multiple modules.', () => {
      expect(() =>
        connect(
          identity,
          [dummyModuleOne, dummyModuleTwo],
          mapModulesToProps,
          options,
        ),
      ).not.toThrow();
    });
  });
});
