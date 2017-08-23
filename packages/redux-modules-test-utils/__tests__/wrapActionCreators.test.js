// @flow
import {forEach, identity} from 'lodash';

import wrapActionCreators from '../src/wrapActionCreators';
import createModule, {type ActionCreator} from '../../redux-modules/src';

describe('`wrapActionCreators`', () => {
  const reduxModule = createModule({
    initialState: {},
    name: 'test',
    transformations: {
      doOtherThing: identity,
      doThing: identity,
    },
  });
  const wrapper: any => any = jest.fn(identity);
  wrapActionCreators(reduxModule, wrapper);
  it('passes each action creator to `wrapper`.', () => {
    forEach(
      reduxModule.actionCreators,
      (actionCreator: ActionCreator<*, *>) => {
        expect(wrapper).toHaveBeenCalledWith(
          actionCreator,
          expect.anything(),
          expect.anything(),
        );
      },
    );
  });
});
