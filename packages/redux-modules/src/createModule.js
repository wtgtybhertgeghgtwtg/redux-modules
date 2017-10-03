// @flow
import createModuleNormalized from './createModuleNormalized';
import normalizeOptions from './normalizeOptions';
import type {
  CreateModuleOptions,
  ExtractActionCreatorType,
  ExtractTransformationType,
  ModuleEnhancer,
  ReduxModule,
} from './types';

/**
 * Create a ReduxModule for the given options.
 * @example
 * createModule({
 *   initialState: {
 *     count: 0,
 *   },
 *   name: 'counter',
 *   transformations: {
 *     // A transformation using only state.
 *     increment: state => ({...state, count: state.count + 1}),
 *     // A transformation using state and action.
 *     incrementBy: (state, action) => ({...state, count: state.count + action.payload}),
 *   }
 * });
 * @example
 * @param {CreateModuleOptions} options The options used to create the ReduxModule.
 * @param {ModuleEnhancer} [enhancer=] An optional module enhancer.
 * @return {ReduxModule} The created ReduxModule.
 */
export default function createModule<S: Object, C: {}>(
  options: CreateModuleOptions<S, C>,
  enhancer?: ModuleEnhancer<S, $ObjMap<C, ExtractTransformationType>>,
): ReduxModule<S, $ObjMap<C, ExtractActionCreatorType>> {
  const normalizedOptions = normalizeOptions(options);
  const result = createModuleNormalized(normalizedOptions, enhancer);
  return result;
  // return createModuleNormalized(normalizedOptions, enhancer);
}
