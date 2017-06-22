// @flow
import canonicalizeOptions from './canonicalizeOptions';
import defaultModuleCreator from './defaultModuleCreator';
import type {
  CreateModuleOptions,
  ExtractActionCreatorType,
  ExtractCanonicalTransformationType,
  ExtractTypeType,
  ModuleCreator,
  ReduxModule,
  Transformations,
} from './types';

export default function createModule<S: Object, T: Transformations<S>>(
  options: CreateModuleOptions<S, T>,
  moduleCreator: ModuleCreator<S, $ObjMap<T, ExtractCanonicalTransformationType>> = defaultModuleCreator,
): ReduxModule<S, $ObjMap<T, ExtractActionCreatorType>, $ObjMap<T, ExtractTypeType>> {
  const canonicalOptions = canonicalizeOptions(options);
  return moduleCreator(canonicalOptions);
}
