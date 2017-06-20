// @flow
import type {Reducer} from 'redux';

export type Action<P, M> = {
  type: string,
  payload?: P,
  error?: bool,
  meta?: M,
};

export type ActionCreator<P, M> = (payload?: P, meta?: M) => Action<P, M>;

export type ExtractActionCreatorType = <P, M>(Reducer<*, Action<P, M>>) => ActionCreator<P, M>;

export type ReducerMap<S> = Map<string, Reducer<S, *>>;

export type ReduxModule<S: Object, T: Transformations<S>> = {
  actionCreators: $ObjMap<T, ExtractActionCreatorType>,
  name: string,
  reducer: Reducer<S, *>,
  types: $ObjMap<T, (transformation: any) => string>,
};

export type Transformations<S: Object> = {
  [name: string]: Reducer<S, Action<*, *>>,
};
