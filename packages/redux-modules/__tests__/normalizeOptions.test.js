// @flow
import {forEach} from 'lodash';

import normalizeOptions from '../src/normalizeOptions';
import type {
  Action,
  CreateModuleOptions,
  ImplicitTransformations,
  Transformation,
} from '../src/types';


function harness<S: Object, C: ImplicitTransformations<S>>(
  options: CreateModuleOptions<S, C>,
) {
  const {initialState, name, transformations} = options;
  const transformationKeys = transformations
    ? Object.keys(transformations)
    : [];
  const normalizedOptions = normalizeOptions(options);

  it('passes all properties of `options`.', () => {
    expect(Object.keys(normalizedOptions)).toEqual(
      expect.arrayContaining(Object.keys(options)),
    );
  });

  it('passes `initialState` as `initialState`.', () => {
    expect(normalizedOptions.initialState).toEqual(initialState);
  });

  it('passes `name` as `name`.', () => {
    expect(normalizedOptions.name).toEqual(name);
  });

  it('creates a canonical transformation for each transformation.', () => {
    expect(Object.keys(normalizedOptions.transformations)).toEqual(
      transformationKeys,
    );
    forEach(
      normalizedOptions.transformations,
      (transformation: Transformation<S, *, *>) => {
        expect(typeof transformation).toEqual('object');
        expect(typeof transformation.reducer).toEqual('function');
      },
    );
  });
}

const name = 'test';
const initialState = {
  propOne: 1,
  propThree: ['three'],
  propTwo: 'two',
};
const otherProp = 'This should remain.';
const transformations = {
  bumpPropOne: state => ({...state, propOne: state.propOne + 1}),
  mergePropThree: (state, action: Action<Array<string>>) => ({
    ...state,
    propThree: [...state.propThree, action.payload],
  }),
  setPropTwo: {
    reducer: (state, action: Action<string>) => ({
      ...state,
      propTwo: action.payload,
    }),
  },
};

describe('normalizeOptions without `name`', () => {
  it('throws.', () => {
    // $FlowFixMe
    expect(() => harness({})).toThrow();
  });
});

describe('normalizeOptions without `initialState`', () => {
  it('throws.', () => {
    // $FlowFixMe
    expect(() => harness({name})).toThrow();
  });
});

describe('normalizeOptions({initialState, name})', () => {
  harness({initialState, name});
});

describe('normalizeOptions({initialState, name, transformations})', () => {
  harness({initialState, name, transformations});
});

describe('normalizeOptions({initialState, otherProp, name, transformations})', () => {
  harness({initialState, name, otherProp, transformations});
});
