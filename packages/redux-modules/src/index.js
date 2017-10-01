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
  ExtractActionCreatorType,
  ExtractTypeType,
  ImplicitTransformation,
  NormalizedCreateModuleOptions,
  ReducerMap,
  ReduxModule,
  Transformation,
} from './types';
