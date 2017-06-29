// @flow
import invariant from 'invariant';
import {isObjectLike} from 'lodash';

import type {ImplicitTransformation, Transformation} from './types';

export default function normalizeTransformation<S: Object, P, M>(
  transformation: ImplicitTransformation<S, P, M>,
  name: string,
): Transformation<S, P, M> {
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
