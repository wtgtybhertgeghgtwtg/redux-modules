// @flow
import defaultModuleCreator from './defaultModuleCreator';
import normalizeOptions from './normalizeOptions';
import type {
  CreateModuleOptions,
  ExtractActionCreatorType,
  ExtractSuperTransformation,
  ExtractTypeType,
  ImplicitTransformations,
  ModuleCreator,
  ReduxModule,
  Transformation,
} from './types';

export default function createModule<
  S: Object,
  T: Transformation<S, *, *>,
  C: ImplicitTransformations<S, T>,
>(
  options: CreateModuleOptions<S, T, C>,
  moduleCreator: ModuleCreator<
    S,
    T,
    $ObjMap<C, ExtractSuperTransformation>,
  > = defaultModuleCreator,
): ReduxModule<
  S,
  $ObjMap<$ObjMap<C, ExtractSuperTransformation>, ExtractActionCreatorType>,
  // ExtractTypeType takes any, so it doesn't have to be extracted.
  $ObjMap<C, ExtractTypeType>,
> {
  const normalOptions = normalizeOptions(options);
  return moduleCreator(normalOptions);
}
