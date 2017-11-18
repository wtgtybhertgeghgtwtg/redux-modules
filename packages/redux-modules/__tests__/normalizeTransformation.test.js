// @flow
import normalizeTransformation from '../src/normalizeTransformation';
import type {ImplicitTransformation} from '../src/types';

function harness<State: Object, Payload, Meta>(
  transformation: ImplicitTransformation<State, Payload, Meta>,
) {
  const canonicalTransformation = normalizeTransformation(
    transformation,
    'test',
  );
  const reducer =
    typeof transformation === 'function'
      ? transformation
      : transformation.reducer;

  it('passes the reducer as `reducer`.', () => {
    expect(reducer).toBe(canonicalTransformation.reducer);
  });

  if (typeof transformation === 'object') {
    it('passes all properties of `transformation`.', () => {
      expect(Object.keys(canonicalTransformation)).toEqual(
        expect.arrayContaining(Object.keys(transformation)),
      );
    });
  }
}

describe('normalizeTransformation with a non-object', () => {
  it('throws.', () => {
    const transformation = 'This is not an object.';
    // $FlowFixMe
    expect(() => harness(transformation)).toThrow();
  });
});

describe('normalizeTransformation with null', () => {
  it('throws.', () => {
    const transformation = null;
    // $FlowFixMe
    expect(() => harness(transformation)).toThrow();
  });
});

describe('normalizeTransformation without a reducer', () => {
  it('throws.', () => {
    const transformation = {};
    // $FlowFixMe
    expect(() => harness(transformation)).toThrow();
  });
});

describe('normalizeTransformation with a non-function reducer', () => {
  it('throws.', () => {
    const transformation = {
      reducer: 'This is not a function.',
    };
    // $FlowFixMe
    expect(() => harness(transformation)).toThrow();
  });
});

describe('normalizeTransformation({reducer})', () => {
  const transformation = {
    reducer: (state: Object) => state,
  };
  harness(transformation);
});

describe('normalizeTransformation({otherProperty, reducer})', () => {
  const transformation = {
    otherProperty: 'This should remain.',
    reducer: (state: Object) => state,
  };
  harness(transformation);
});

describe('canonicalTransformation with an implicit reducer', () => {
  const transformation = (state: Object) => state;
  harness(transformation);
});
