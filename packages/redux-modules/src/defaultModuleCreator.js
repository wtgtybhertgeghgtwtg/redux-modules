// @flow
import {forEach} from 'lodash';

import createActionCreator from './createActionCreator';
import createReducer from './createReducer';
import formatType from './formatType';
import type {
  CanonicalCreateModuleOptions,
  CanonicalTransformation,
  CanonicalTransformations,
  ExtractActionCreatorType,
  ExtractTypeType,
  ReduxModule,
} from './types';

export default function defaultModuleCreator<
  S: Object,
  C: CanonicalTransformations<S>,
>(
  options: CanonicalCreateModuleOptions<S, C>,
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
    ({reducer}: CanonicalTransformation<S, *, *>, actionName: string) => {
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
