// @flow
import {identity} from 'lodash';

import defaultMapModulesToProps from '../src/defaultMapModulesToProps';
import createModule from '../../redux-modules/src';
import {wrapActionCreators} from '../../redux-modules-test-utils/src';

describe('defaultMapModulesToProps', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const moduleOne = wrapActionCreators(
    createModule({
      initialState: {},
      name: 'moduleOne',
      transformations: {
        doOtherThing: identity,
        doThing: identity,
      },
    }),
    jest.fn,
  );
  const moduleTwo = wrapActionCreators(
    createModule({
      initialState: {},
      name: 'moduleTwo',
      transformations: {
        doOtherThing: identity,
        doThirdThing: identity,
      },
    }),
    jest.fn,
  );

  describe('with one module', () => {
    const props = defaultMapModulesToProps([moduleOne]);
    it('returns the actionCreators of that module.', () => {
      expect(moduleOne.actionCreators.doThing).not.toHaveBeenCalled();
      expect(moduleOne.actionCreators.doOtherThing).not.toHaveBeenCalled();
      props.doThing();
      expect(moduleOne.actionCreators.doThing).toHaveBeenCalled();
      props.doOtherThing();
      expect(moduleOne.actionCreators.doOtherThing).toHaveBeenCalled();
    });
  });

  describe('with multiple modules', () => {
    const props = defaultMapModulesToProps([moduleOne, moduleTwo]);
    it('returns the spread actionCreators of those modules.', () => {
      expect(moduleOne.actionCreators.doThing).not.toHaveBeenCalled();
      expect(moduleOne.actionCreators.doOtherThing).not.toHaveBeenCalled();
      expect(moduleTwo.actionCreators.doOtherThing).not.toHaveBeenCalled();
      expect(moduleTwo.actionCreators.doThirdThing).not.toHaveBeenCalled();
      props.doThing();
      expect(moduleOne.actionCreators.doThing).toHaveBeenCalled();
      props.doOtherThing();
      // Since the one from `moduleTwo` overwrites it.
      expect(moduleOne.actionCreators.doOtherThing).not.toHaveBeenCalled();
      expect(moduleTwo.actionCreators.doOtherThing).toHaveBeenCalled();
      props.doThirdThing();
      expect(moduleTwo.actionCreators.doThirdThing).toHaveBeenCalled();
    });
  });
});
