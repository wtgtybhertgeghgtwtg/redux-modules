// @flow
import invariant from 'invariant';
import {isObjectLike, mapValues} from 'lodash';

import normalizeTransformation from './normalizeTransformation';
import type {
  CreateModuleOptions,
  ExtractTransformationType,
  ImplicitTransformations,
  NormalizedCreateModuleOptions,
} from './types';

/**
 * @private
 * Validate and normalize the options passed to `createModule`.  Shorthand will be expanded.
 * @example
 * normalizeOptions({
 *   // Will throw if null or not an object.
 *   initialState: {},
 *   // Will throw if undefined.
 *   name: 'example',
 *   transformations: {
 *     // Will become {reducer: state => state}.
 *     doThing: state => state,
 *   },
 * });
 * @example
 * @param {CreateModuleOptions} options The raw options passed to `createModule`.
 * @return {NormalizedCreateModuleOptions} A normalized version of the given options.
 */
export default function normalizeOptions<
  S: Object,
  C: ImplicitTransformations<S>,
>(
  options: CreateModuleOptions<S, C>,
): NormalizedCreateModuleOptions<S, $ObjMap<C, ExtractTransformationType>> {
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
