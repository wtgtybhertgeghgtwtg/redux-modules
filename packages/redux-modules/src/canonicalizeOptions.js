// @flow
import invariant from 'invariant';
import {isObjectLike, mapValues} from 'lodash';

import canonicalizeTransformation from './canonicalizeTransformation';
import type {
  CanonicalCreateModuleOptions,
  CreateModuleOptions,
  ExtractCanonicalTransformationType,
  Transformations,
} from './types';

export default function canonicalizeOptions<S: Object, T: Transformations<S>>(options: CreateModuleOptions<S, T>): CanonicalCreateModuleOptions<S, $ObjMap<T, ExtractCanonicalTransformationType>> {
  const {initialState, name, transformations = { }} = options;
  invariant(name, '`name` must be defined.');
  invariant(isObjectLike(initialState), '`initialState` must be an object.');
  const canonicalTransformations = mapValues(transformations, canonicalizeTransformation);
  return {
    ...options,
    transformations: canonicalTransformations,
  };
}
