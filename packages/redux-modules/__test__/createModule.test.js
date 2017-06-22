
import createModule, {type createModuleOptions} from '../src/createModule';

import type {Transformations} from '../src/types';

function harness<S: Object, T: Transformations<S>>(options: createModuleOptions<S, T>) {
  const {name, initialState, transformations} = options;
  const transformationKeys = transformations ? Object.keys(transformations) : [];
  const testModule = createModule({initialState, name, transformations});

  it('passes `name` as `name`.', () => {
    expect(testModule.name).toEqual(name);
  });

  it('creates an action creator for each key in `transformations`', () => {
    expect(Object.keys(testModule.actionCreators)).toEqual(transformationKeys);
  });

  it('creates a type for each key in `transformations`.', () => {
    expect(Object.keys(testModule.types)).toEqual(transformationKeys);
  });

  it('creates a reducer.', () => {
    expect(typeof testModule.reducer).toEqual('function');
  });
}

describe('createModule without `name`', () => {
  it('throws.', () => {
    // $FlowFixMe
    expect(() => harness({})).toThrow();
  });
});

describe('createModule without `initialState`', () => {
  it('throws.', () => {
    const name = 'test';
    // $FlowFixMe
    expect(() => harness({name})).toThrow();
  });
});

describe('createModule({ name, initialState })', () => {
  const name = 'test';
  const initialState = {
    propOne: 1,
    propTwo: 'two',
  };
  harness({initialState, name});
});

describe('createModule({ name, initialState, transformations })', () => {
  const name = 'test';
  const initialState = {
    propOne: 1,
    propTwo: 'two',
  };
  const transformations = {
    bumpPropOne: state => ({...state, propOne: state.propOne + 1}),
    setPropTwo: (state, action) => ({...state, propTwo: action.payload}),
  };
  harness({initialState, name, transformations});
});
