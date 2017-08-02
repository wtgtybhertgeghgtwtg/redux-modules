// @flow
import {forEach} from 'lodash';

import createActionCreator from './createActionCreator';
import createReducer from './createReducer';
import formatType from './formatType';
import type {
  ExtractActionCreatorType,
  ExtractTypeType,
  NormalizedCreateModuleOptions,
  ReduxModule,
  Transformation,
  Transformations,
} from './types';

/**
 * @private
 * The default ModuleCreator.  Creates a ReduxModule for the given options.
 * @param {NormalizedCreateModuleOptions} options The options used to create the ReduxModule.  Shorthand has been normalized away.
 * @return {ReduxModule} The created ReduxModule.
 */
export default function defaultModuleCreator<S: Object, C: Transformations<S>>(
  options: NormalizedCreateModuleOptions<S, C>,
): ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
> {
  const {initialState, name, transformations} = options;
  const actionCreators = Object.create(null);
  const types = Object.create(null);
  const reducerMap = new Map();
  forEach(
    transformations,
    ({reducer}: Transformation<S, *, *>, actionName: string) => {
      const type = formatType(name, actionName);
      actionCreators[actionName] = createActionCreator(type);
      types[actionName] = type;
      reducerMap.set(type, reducer);
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
