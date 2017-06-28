// @flow
import invariant from 'invariant';
import {isObjectLike, mapValues} from 'lodash';

import normalizeTransformation from './normalizeTransformation';
import type {
  CreateModuleOptions,
  ExtractSuperTransformation,
  ImplicitTransformations,
  NormalizedCreateModuleOptions,
} from './types';

export default function normalizeOptions<
  S: Object,
  C: ImplicitTransformations<S>,
>(
  options: CreateModuleOptions<S, C>,
): NormalizedCreateModuleOptions<S, $ObjMap<C, ExtractSuperTransformation>> {
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
