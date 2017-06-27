// @flow
import type {
  Action,
  ActionCreators,
  ReduxModule as BaseReduxModule,
  // Transformation as BaseTransformation,
  Types,
} from '@wtg/redux-modules';
import type {Reducer} from 'redux';

export type ReduxModule<S: Object, A: ActionCreators, T: Types> = {
  // ...BaseReduxModule<S, A, T>,
  actionCreators: A,
  name: string,
  reducer: Reducer<S, *>,
  types: T,
  sagas: Sagas,
};

export type Saga<P, M> = () => Generator<*, void, *>;

export type SagaCreator<A: ActionCreators, T: Types, P, M> = ({
  actionCreators: A,
  types: T,
}) => Saga<P, M>;

export type SagaCreatorProps<
  S: Object,
  A: ActionCreators,
  T: Types,
  R: BaseReduxModule<S, A, T>,
> = {
  actionCreators: A,
  types: T,
};

export type Sagas = {
  [name: string]: Saga<*, *>,
};

export type Transformation<S: Object, A: ActionCreators, T: Types, P, M> = {
  // ...BaseTransformation<S, P, M>,
  reducer: Reducer<S, Action<P, M>>,
  sagaCreator?: SagaCreator<A, T, P, M>,
};
