// @flow
import bindModuleWithState, {type BoundModuleWithState} from '../src/bindModuleWithState';
import createModule, {type ReduxModule} from '../../redux-modules/src';

type State = {
  propOne: number,
  propTwo: string,
  propThree: ?boolean,
};

const initialState = {
  propOne: 1,
  propThree: false,
  propTwo: 'two',
};
const transformations = {
  bumpPropOne: state => ({...state, propOne: state.propOne + 1}),
  // Please don't use `meta` like this.
  setPropThree: (state, action) => ({...state, propThree: action.meta}),
  setPropTwo: (state, action) => ({...state, propTwo: action.payload}),
};
const reduxModule: ReduxModule<State, typeof transformations> = createModule({
  initialState,
  name: 'test',
  transformations,
});
// Something other than `initialState` just so we know it isn't reading from that.
const testState = {
  propOne: 2,
  propThree: null,
  propTwo: 'three',
};
const boundModule: BoundModuleWithState<State, typeof transformations> = bindModuleWithState(reduxModule, testState);

describe('the object returned by `bindModule`', () => {
  it('matches the keys of `actionCreators`.', () => {
    const actionCreatorKeys = Object.keys(reduxModule.actionCreators);
    const boundModuleKeys = Object.keys(boundModule);
    expect(boundModuleKeys).toEqual(expect.arrayContaining(actionCreatorKeys));
    expect(boundModuleKeys.length).toBe(actionCreatorKeys.length);
  });
});

describe('the functions of the object returned by `bindModule`', () => {
  it('works with transformations that only use `state`.', () => {
    const expectedState = {
      propOne: 3,
      propThree: null,
      propTwo: 'three',
    };
    const result = boundModule.bumpPropOne();
    expect(result).toEqual(expectedState);
  });

  it('works with transformations that use `payload`.', () => {
    const expectedState = {
      propOne: 2,
      propThree: null,
      propTwo: 'four',
    };
    const result = boundModule.setPropTwo('four');
    expect(result).toEqual(expectedState);
  });

  it('works with transformations that use `meta`.', () => {
    const expectedState = {
      propOne: 2,
      propThree: true,
      propTwo: 'three',
    };
    const result = boundModule.setPropThree(null, true);
    expect(result).toEqual(expectedState);
  });
});
