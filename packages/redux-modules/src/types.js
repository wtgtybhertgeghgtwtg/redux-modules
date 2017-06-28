// @flow
import type {Reducer} from 'redux';

export type Action<P, M> = {
  type: string,
  payload: P,
  error: boolean,
  meta: M,
};

export type ActionCreator<P, M> = (payload: P, meta: M) => Action<P, M>;

export type ActionCreators = StringMap<ActionCreator<*, *>>;

export type CreateModuleOptions<S: Object, C: ImplicitTransformations<S>> = {
  initialState: S,
  name: string,
  transformations?: C,
};

export type ExtractActionCreatorType = <P, M>(
  Reducer<*, Action<P, M>> | Transformation<*, P, M>,
) => ActionCreator<P, M>;

export type ExtractSuperTransformation = <
  S: Object,
  P,
  M,
  T: Transformation<S, P, M>,
>(
  ImplicitTransformation<S, P, M, T>,
) => SuperTransformation<S, P, M, T>;

// This is dumb.
export type ExtractTypeType = any => string;

export type ImplicitTransformation<
  S: Object,
  P,
  M,
  T: Transformation<S, P, M>,
> = Reducer<S, Action<P, M>> | SuperTransformation<S, P, M, T>;

export type ImplicitTransformations<S> = {
  [name: string]:
    | Reducer<S, any>
    | {
        reducer: Reducer<S, any>,
      },
};

export type ModuleCreator<S: Object, C: SuperTransformations<S, *>> = (
  options: NormalizedCreateModuleOptions<S, C>,
) => ReduxModule<
  S,
  $ObjMap<C, ExtractActionCreatorType>,
  $ObjMap<C, ExtractTypeType>,
>;

export type NormalizedCreateModuleOptions<
  S: Object,
  C: SuperTransformations<S, *>,
> = {
  initialState: S,
  name: string,
  transformations: C,
};

export type ReducerMap<S> = Map<string, Reducer<S, *>>;

export type ReduxModule<S: Object, A: ActionCreators, T: Types> = {
  actionCreators: A,
  name: string,
  reducer: Reducer<S, *>,
  types: T,
};

export type StringMap<T> = {
  [name: string]: T,
};

export type SuperTransformation<
  S: Object,
  P,
  M,
  T: Transformation<S, P, M>,
> = Transformation<S, P, M> & $Shape<T>;

export type SuperTransformations<S, T: Transformation<S, *, *>> = StringMap<
  SuperTransformation<S, *, *, T>,
>;

export type Transformation<S: Object, P, M> = {
  reducer: Reducer<S, Action<P, M>>,
};

// This is also dumb.
export type Types = StringMap<string>;
