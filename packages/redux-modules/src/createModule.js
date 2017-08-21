// @flow
import defaultModuleCreator from './defaultModuleCreator';
import normalizeOptions from './normalizeOptions';
import type {
  CreateModuleOptions,
  ExtractActionCreatorType,
  ExtractTransformationType,
  ImplicitTransformations,
  ModuleCreator,
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
 * @param {ModuleCreator} [moduleCreator=defaultModuleCreator] The ModuleCreator used to parse options.
 * @return {ReduxModule} The created ReduxModule.
 */
export default function createModule<S: Object, C: ImplicitTransformations<S>>(
  options: CreateModuleOptions<S, C>,
  moduleCreator: ModuleCreator<
    S,
    $ObjMap<C, ExtractTransformationType>,
  > = defaultModuleCreator,
): ReduxModule<S, $ObjMap<C, ExtractActionCreatorType>> {
  const normalOptions = normalizeOptions(options);
  return moduleCreator(normalOptions);
}
