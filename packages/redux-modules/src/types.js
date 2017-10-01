// @flow
import type {Reducer} from 'redux';

export type Action<P = void, M = void> = {
  type: string,
  payload: P,
  error: boolean,
  meta: M,
};

export type ActionCreator<P, M> = (payload: P, meta: M) => Action<P, M>;

export type CreateModuleOptions<S: Object, C: ImplicitTransformations<S>> = {
  initialState: S,
  name: string,
  transformations?: C,
};

export type ExtractActionCreatorType = <P, M>(
  Reducer<*, Action<P, M>> | Transformation<*, P, M>,
) => ActionCreator<P, M>;

export type ExtractTransformationType = <S: Object, P, M>(
  ImplicitTransformation<S, P, M>,
) => Transformation<S, P, M>;

// This is dumb.
export type ExtractTypeType = any => string;

export type ImplicitTransformation<S: Object, P, M> =
  | Reducer<S, Action<P, M>>
  | Transformation<S, P, M>;

export type ImplicitTransformations<S: Object> = {
  [name: string]: ImplicitTransformation<S, any, any>,
};

export type ModuleCreator<S: Object, C: {}> = (
  options: NormalizedCreateModuleOptions<S, C>,
) => ReduxModule<S, $ObjMap<C, ExtractActionCreatorType>>;

export type NormalizedCreateModuleOptions<S: Object, C: {}> = {
  initialState: S,
  name: string,
  transformations: C,
};

export type ReducerMap<S> = Map<string, Reducer<S, *>>;

export type ReduxModule<S: Object, A> = {
  actionCreators: A,
  name: string,
  reducer: Reducer<S, *>,
  types: $ObjMap<A, ExtractTypeType>,
};

export type Transformation<S: Object, P, M> = {
  reducer: Reducer<S, Action<P, M>>,
};
