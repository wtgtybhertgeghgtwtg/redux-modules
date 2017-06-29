// @flow
import {
  createActionCreator,
  createReducer,
  formatType,
  type ExtractActionCreatorType,
  type ExtractTypeType,
  type NormalizedCreateModuleOptions,
  type Transformations,
} from '@wtg/redux-modules';
import {forEach, mapValues} from 'lodash';

import type {ReduxModule, Transformation} from './types';

export default function moduleCreator<S: Object, C: Transformations<S>>(
  options: NormalizedCreateModuleOptions<S, C>,
): ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
> {
  const {initialState, name, transformations} = options;
  const types: $ObjMap<
    C,
    ExtractTypeType,
  > = mapValues(
    transformations,
    (_: Transformation<S, *, *, *, *>, actionName: string) =>
      formatType(name, actionName),
  );
  const actionCreators = mapValues(types, createActionCreator);
  const reducerMap = new Map();
  const sagas = Object.create(null);
  forEach(
    transformations,
    (transformation: Transformation<S, *, *, *, *>, actionName: string) => {
      const {reducer, sagaCreator} = transformation;
      reducerMap.set(types[actionName], reducer);
      if (sagaCreator) {
        sagas[actionName] = sagaCreator({actionCreators, types});
      }
    },
  );
  const reducer = createReducer(reducerMap, initialState);
  return {
    actionCreators,
    name,
    reducer,
    sagas,
    types,
  };
}
