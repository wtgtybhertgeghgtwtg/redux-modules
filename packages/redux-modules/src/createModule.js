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
} from './types';

export default function createModule<S: Object, C: ImplicitTransformations<S>>(
  options: CreateModuleOptions<S, C>,
  moduleCreator: ModuleCreator<
    S,
    $ObjMap<C, ExtractSuperTransformation>,
  > = defaultModuleCreator,
): ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
> {
  const normalOptions = normalizeOptions(options);
  return moduleCreator(normalOptions);
}
