// @flow
import invariant from 'invariant';
import {forEach, isObjectLike} from 'lodash';

import type {Reducer} from 'redux';

import type {ExtractActionCreatorType, ReducerMap, ReduxModule, Transformations} from './types';

import createActionCreator from './createActionCreator';
import createReducer from './createReducer';
import formatType from './formatType';

export type createModuleOptions<S: Object, T: Transformations<S>> = {
  initialState: S,
  name: string,
  transformations?: T,
};

export default function createModule<S: Object, T: Transformations<S>>(options: createModuleOptions<S, T>): ReduxModule<S, T> {
  const {initialState, name, transformations = { }} = options;
  invariant(name, '`name` must be defined.');
  invariant(isObjectLike(initialState), '`initialState` must be an object.');
  const actionCreators: $ObjMap<T, ExtractActionCreatorType> = Object.create(null);
  const types: $ObjMap<T, (transformation: any) => string> = Object.create(null);
  const reducerMap: ReducerMap<S> = new Map();
  forEach(transformations, (reducer: Reducer<S, *>, actionName: string) => {
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
