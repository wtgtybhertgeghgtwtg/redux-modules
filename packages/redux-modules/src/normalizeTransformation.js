// @flow
import invariant from 'invariant';
import {isObjectLike} from 'lodash';

import type {
  ImplicitTransformation,
  SuperTransformation,
  Transformation,
} from './types';

export default function normalizeTransformation<
  S: Object,
  P,
  M,
  T: Transformation<S, P, M>,
>(
  transformation: ImplicitTransformation<S, P, M, T>,
  name: string,
): SuperTransformation<S, P, M, T> {
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
