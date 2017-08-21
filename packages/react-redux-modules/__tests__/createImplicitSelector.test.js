// @flow
import createImplicitSelector from '../src/createImplicitSelector';
import createModule from '../../redux-modules/src';

describe('createImplicitSelector', () => {
  const moduleOne = createModule({
    initialState: {},
    name: 'moduleOne',
  });
  const moduleTwo = createModule({
    initialState: {},
    name: 'moduleTwo',
  });
  const moduleOneState = {
    isFirst: true,
    statement: 'This gets overwritten.',
  };
  const moduleTwoState = {
    isSecond: true,
    statement: 'This does not.',
  };
  const state = {
    moduleOne: moduleOneState,
    moduleTwo: moduleTwoState,
  };

  describe('with one module', () => {
    const selector = createImplicitSelector([moduleOne]);
    it('returns the state for that module.', () => {
      const result = selector(state, {});
      expect(result).toEqual(moduleOneState);
    });
  });

  describe('with two modules', () => {
    const selector = createImplicitSelector([moduleOne, moduleTwo]);
    it('returns the spread of properties from both states.', () => {
      const result = selector(state, {});
      const expected = Object.assign({}, moduleOneState, moduleTwoState);
      expect(result).toEqual(expected);
    });
  });
});
