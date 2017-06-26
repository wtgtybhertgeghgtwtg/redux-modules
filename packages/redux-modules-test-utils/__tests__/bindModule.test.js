// @flow
import bindModule from '../src/bindModule';
import createModule from '../../redux-modules/src';

type State = {
  propOne: number,
  propThree: ?boolean,
  propTwo: string,
};

const initialState: State = {
  propOne: 1,
  propThree: false,
  propTwo: 'two',
};
const transformations = {
  bumpPropOne: state => ({...state, propOne: state.propOne + 1}),
  // Please don't use `meta` like this.
  setPropThree: (state, {meta}) => ({...state, propThree: meta}),
  setPropTwo: (state, {payload}) => ({...state, propTwo: payload}),
};
const reduxModule = createModule({
  initialState,
  name: 'test',
  transformations,
});
const boundModule = bindModule(reduxModule);

describe('the object returned by `bindModule`', () => {
  it('matches the keys of `actionCreators`.', () => {
    const actionCreatorKeys = Object.keys(reduxModule.actionCreators);
    const boundModuleKeys = Object.keys(boundModule);
    expect(boundModuleKeys).toEqual(expect.arrayContaining(actionCreatorKeys));
    expect(boundModuleKeys.length).toBe(actionCreatorKeys.length);
  });
});

describe('the functions of the object returned by `bindModule`', () => {
  // Something other than `initialState` just so we know it isn't reading from that.
  const testState = {
    propOne: 2,
    propThree: null,
    propTwo: 'three',
  };

  it('works with transformations that only use `state`.', () => {
    const expectedState = {
      propOne: 3,
      propThree: null,
      propTwo: 'three',
    };
    const result = boundModule.bumpPropOne(testState);
    expect(result).toEqual(expectedState);
  });

  it('works with transformations that use `payload`.', () => {
    const expectedState = {
      propOne: 2,
      propThree: null,
      propTwo: 'four',
    };
    const result = boundModule.setPropTwo(testState, 'four');
    expect(result).toEqual(expectedState);
  });

  it('works with transformations that use `meta`.', () => {
    const expectedState = {
      propOne: 2,
      propThree: true,
      propTwo: 'three',
    };
    const result = boundModule.setPropThree(testState, null, true);
    expect(result).toEqual(expectedState);
  });
});
