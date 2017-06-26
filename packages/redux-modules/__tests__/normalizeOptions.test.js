import {forEach} from 'lodash';

import normalizeOptions from '../src/normalizeOptions';
import type {
  CanonicalTransformation,
  CreateModuleOptions,
  Transformations,
} from '../src/types';

function harness<S: Object, T: Transformations<S>>(
  options: CreateModuleOptions<S, T>,
) {
  const {initialState, name, transformations} = options;
  const transformationKeys = transformations
    ? Object.keys(transformations)
    : [];
  const canonicalOptions = normalizeOptions(options);

  it('passes all properties of `options`.', () => {
    expect(Object.keys(canonicalOptions)).toEqual(
      expect.arrayContaining(Object.keys(options)),
    );
  });

  it('passes `initialState` as `initialState`.', () => {
    expect(canonicalOptions.initialState).toEqual(initialState);
  });

  it('passes `name` as `name`.', () => {
    expect(canonicalOptions.name).toEqual(name);
  });

  it('creates a canonical transformation for each transformation.', () => {
    expect(Object.keys(canonicalOptions.transformations)).toEqual(
      transformationKeys,
    );
    forEach(
      canonicalOptions.transformations,
      (transformation: CanonicalTransformation<S, *, *>) => {
        expect(typeof transformation).toEqual('object');
        expect(typeof transformation.reducer).toEqual('function');
      },
    );
  });
}

describe('normalizeOptions without `name`', () => {
  it('throws.', () => {
    // $FlowFixMe
    expect(() => harness({})).toThrow();
  });
});

describe('normalizeOptions without `initialState`', () => {
  it('throws.', () => {
    const name = 'test';
    // $FlowFixMe
    expect(() => harness({name})).toThrow();
  });
});

describe('normalizeOptions({initialState, name})', () => {
  const initialState = {
    propOne: 1,
    propTwo: 'two',
  };
  const name = 'test';
  harness({initialState, name});
});

describe('normalizeOptions({initialState, name, transformations})', () => {
  const name = 'test';
  const initialState = {
    propOne: 1,
    propTwo: 'two',
  };
  const transformations = {
    bumpPropOne: state => ({...state, propOne: state.propOne + 1}),
    setPropTwo: {
      reducer: (state, action) => ({...state, propTwo: action.payload}),
    },
  };
  harness({initialState, name, transformations});
});

describe('normalizeOptions({initialState, otherProp, name, transformations})', () => {
  const name = 'test';
  const initialState = {
    propOne: 1,
    propTwo: 'two',
  };
  const otherProp = 'This should remain.';
  const transformations = {
    bumpPropOne: state => ({...state, propOne: state.propOne + 1}),
    setPropTwo: {
      reducer: (state, action) => ({...state, propTwo: action.payload}),
    },
  };
  harness({initialState, name, otherProp, transformations});
});
