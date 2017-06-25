// @flow
import defaultModuleCreator from './defaultModuleCreator';
import normalizeOptions from './normalizeOptions';
import type {
  CreateModuleOptions,
  ExtractActionCreatorType,
  ExtractSuperTransformation,
  ExtractTypeType,
  ImplicitTransformations,
  NormalizedCreateModuleOptions,
  ReduxModule,
  SuperTransformations,
  Transformation,
} from './types';

export type ModuleCreator<
  S: Object,
  T: Transformation<S, *, *>,
  C: SuperTransformations<S, T>,
> = (
  options: NormalizedCreateModuleOptions<S, T, C>,
) => ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
>;

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
