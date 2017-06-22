// @flow
import invariant from 'invariant';
import {isObjectLike} from 'lodash';

import type {CanonicalTransformation, Transformation} from './types';

export default function canonicalizeTransformation<S: Object, P, M>(
  transformation: Transformation<S, P, M>,
  name: string,
): CanonicalTransformation<S, P, M> {
  if (typeof transformation === 'function') {
    return {
      reducer: transformation,
    };
  }
  invariant(
    isObjectLike(transformation),
    `'${name}' must be a a reducer or object.`,
  );
  invariant(
    typeof transformation.reducer === 'function',
    `'${name}.reducer' must be a reducer.`,
  );
  return transformation;
}
