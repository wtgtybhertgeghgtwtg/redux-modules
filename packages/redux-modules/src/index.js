// @flow
import createActionCreator from './createActionCreator';
import createModule from './createModule';
import createReducer from './createReducer';
import formatType from './formatType';

export {createActionCreator, createModule, createReducer, formatType};

export default createModule;

export type {
  Action,
  ActionCreator,
  ActionCreators,
  ExtractActionCreatorType,
  ExtractTypeType,
  ImplicitTransformation,
  ImplicitTransformations,
  NormalizedCreateModuleOptions,
  ReducerMap,
  ReduxModule,
  Transformation,
  // Transformations,
  Types,
} from './types';
