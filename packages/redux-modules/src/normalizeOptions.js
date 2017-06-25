// @flow
import invariant from 'invariant';
import {isObjectLike, mapValues} from 'lodash';

import normalizeTransformation from './normalizeTransformation';
import type {
  CreateModuleOptions,
  ExtractSuperTransformation,
  ImplicitTransformations,
  NormalizedCreateModuleOptions,
  Transformation,
} from './types';

export default function normalizeOptions<
  S: Object,
  T: Transformation<S, *, *>,
  C: ImplicitTransformations<S, T>,
>(
  options: CreateModuleOptions<S, T, C>,
): NormalizedCreateModuleOptions<S, T, $ObjMap<C, ExtractSuperTransformation>> {
  const {initialState, name, transformations = {}} = options;
  invariant(name, '`name` must be defined.');
  invariant(isObjectLike(initialState), '`initialState` must be an object.');
  const normalTransformations = mapValues(
    transformations,
    normalizeTransformation,
  );
  return {
    ...options,
    transformations: normalTransformations,
  };
}
