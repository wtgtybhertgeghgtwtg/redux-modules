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
  StringMap,
  Transformation,
} from './types';

export default function defaultModuleCreator<
  S: Object,
  T: Transformation<S, *, *>,
  C: StringMap<T>,
>(
  options: NormalizedCreateModuleOptions<S, T, C>,
): ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
> {
  const {initialState, name, transformations} = options;
  const actionCreators = Object.create(null);
  const types = Object.create(null);
  const reducerMap = new Map();
  forEach(transformations, ({reducer}: T, actionName: string) => {
    const type = formatType(name, actionName);
    actionCreators[actionName] = createActionCreator(type);
    types[actionName] = type;
    reducerMap.set(type, reducer);
  });
  const reducer = createReducer(reducerMap, initialState);
  return {
    actionCreators,
    name,
    reducer,
    types,
  };
}
