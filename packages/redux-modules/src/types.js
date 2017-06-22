// @flow
import type {Reducer} from 'redux';

export type Action<P, M> = {
  type: string,
  payload?: P,
  error?: boolean,
  meta?: M,
};

// Genericize?
export type ActionCreator<P, M> = (payload?: P, meta?: M) => Action<P, M>;

export type ActionCreators = {
  [name: string]: ActionCreator<*, *>,
};

export type CanonicalCreateModuleOptions<S: Object, T: CanonicalTransformations<S>> = {
  initialState: S,
  name: string,
  transformations: T,
};

export type CanonicalTransformation<S: Object, P, M> = {
  reducer: Reducer<S, Action<P, M>>,
};

export type CanonicalTransformations<S: Object> = {
  [name: string]: CanonicalTransformation<S, *, *>,
};

// CanonicalTransformationsFromTransformations<T> is actually the exact same length as $ObjMap<T, ExtractCanonicalTransformationType>.
export type CanonicalTransformationsFromTransformations<T: Transformations<*>> = $ObjMap<T, ExtractCanonicalTransformationType>;

export type CreateModuleOptions<S, T: Transformations<S>> = {
  initialState: S,
  name: string,
  transformations?: T,
};

export type ExtractActionCreatorType = <P, M>(Transformation<*, P, M>) => ActionCreator<P, M>;

export type ExtractCanonicalTransformationType = <S, P, M>(Transformation<S, P, M>) => CanonicalTransformation<S, P, M>;

// This is dumb.
export type ExtractTypeType = (any) => string;

export type ModuleCreator<S: Object, C: CanonicalTransformations<S>> = (options: CanonicalCreateModuleOptions<S, C>) => ReduxModule<S, $ObjMap<C, ExtractActionCreatorType>, $ObjMap<C, ExtractTypeType>>;

export type ReducerMap<S> = Map<string, Reducer<S, *>>;

export type ReduxModule<S: Object, A: ActionCreators, T: Types> = {
  actionCreators: A,
  name: string,
  reducer: Reducer<S, *>,
  types: T,
};

export type Transformation<S: Object, P, M> = CanonicalTransformation<S, P, M> | Reducer<S, Action<P, M>>;

export type Transformations<S: Object> = {
  [name: string]: Transformation<S, *, *>
};

// This one is just dumb.
export type Types = {
  [name: string]: string,
};
