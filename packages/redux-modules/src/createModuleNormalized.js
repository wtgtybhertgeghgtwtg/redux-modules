// @flow
import {forEach} from 'lodash';

import createActionCreator from './createActionCreator';
import createReducer from './createReducer';
import formatType from './formatType';
import type {
  ExtractActionCreatorType,
  ModuleEnhancer,
  NormalizedCreateModuleOptions,
  ReduxModule,
  Transformation,
} from './types';

/**
 * Create a ReduxModule for the given normalized options.
 * @param {CreateModuleOptions} options The normalized options used to create the ReduxModule.
 * @param {ModuleEnhancer} [enhancer=] An optional module enhancer.
 * @return {ReduxModule} The created ReduxModule.
 */
export default function createModuleNormalized<S: Object, C: {}>(
  options: NormalizedCreateModuleOptions<S, C>,
  enhancer?: ModuleEnhancer<S, C>,
): ReduxModule<S, $ObjMap<C, ExtractActionCreatorType>> {
  if (enhancer) {
    return enhancer(createModuleNormalized)(options);
  }
  const {initialState, name, transformations} = options;
  const actionCreators: $ObjMap<C, ExtractActionCreatorType> = {};
  const types: $ObjMap<C, () => string> = {};
  const reducerMap = new Map();
  forEach(
    transformations,
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
