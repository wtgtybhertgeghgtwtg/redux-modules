// @flow
import {
  createActionCreator,
  createReducer,
  formatType,
  type ExtractActionCreatorType,
  type ExtractTypeType,
  type NormalizedCreateModuleOptions,
  type SuperTransformations,
} from '@wtg/redux-modules';
import {forEach, mapValues} from 'lodash';

import type {ReduxModule, Transformation} from './types';

export default function moduleCreator<
  S: Object,
  T: Transformation<S, *, *, *>,
  C: SuperTransformations<S, T>,
>(
  options: NormalizedCreateModuleOptions<S, T, C>,
): ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
> {
  const {initialState, name, transformations} = options;
  const types: $ObjMap<
    C,
    ExtractTypeType,
  > = mapValues(transformations, (_: T, actionName: string) =>
    formatType(name, actionName),
  );
  const actionCreators = mapValues(types, createActionCreator);
  const reducerMap = new Map();
  const sagas = Object.create(null);
  forEach(transformations, (transformation: T, actionName: string) => {
    const {reducer, sagaCreator} = transformation;
    reducerMap.set(types[actionName], reducer);
    if (sagaCreator) {
      sagas[actionName] = sagaCreator(actionCreators);
    }
  });
  const reducer = createReducer(reducerMap, initialState);
  return {
    actionCreators,
    name,
    reducer,
    sagas,
    types,
  };
}
