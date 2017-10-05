// @flow
import invariant from 'invariant';
import {forEach, isObjectLike, mapValues} from 'lodash';

import createActionCreator from './createActionCreator';
import createReducer from './createReducer';
import formatType from './formatType';
import normalizeTransformation from './normalizeTransformation';
import type {
  CreateModuleOptions,
  ExtractActionCreatorType,
  ExtractTransformationType,
  ModuleEnhancer,
  ReduxModule,
  Transformation,
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
  if (enhancer) {
    return enhancer(createModule)(options);
  }
  const {initialState, name, transformations = {}} = options;
  invariant(name, '`name` must be defined.');
  invariant(isObjectLike(initialState), '`initialState` must be an object.');
  invariant(
    isObjectLike(transformations),
    '`transformations` must be an object or undefined.',
  );

  const actionCreators: $ObjMap<C, ExtractActionCreatorType> = {};
  const types: $ObjMap<C, () => string> = {};
  const reducerMap = new Map();
  forEach(
    mapValues(transformations, normalizeTransformation),
    (transformation: Transformation<S, any, any>, actionName: string) => {
      const type = formatType(name, actionName);
      actionCreators[actionName] = createActionCreator(type);
      types[actionName] = type;
      reducerMap.set(type, transformation.reducer);
    },
  );
  const reducer = createReducer(reducerMap, initialState);
  return {
    actionCreators,
    name,
    reducer,
    types,
  };
}
