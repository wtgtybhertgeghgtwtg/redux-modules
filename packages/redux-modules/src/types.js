// @flow
import type {Reducer} from 'redux';

export type Action<Payload, Meta = void> = {
  type: string,
  payload: Payload,
  error: boolean,
  meta: Meta,
};

export type ActionCreator<Payload, Meta> = (
  payload: Payload,
  meta: Meta,
) => Action<Payload, Meta>;

export type CreateModuleOptions<State: Object, IMap: {}> = {
  initialState: State,
  name: string,
  transformations?: IMap,
};

export type ExtractActionCreatorType = <Payload, Meta>(
  Reducer<any, Action<Payload, Meta>> | Transformation<any, Payload, Meta>,
) => ActionCreator<Payload, Meta>;

export type ExtractTransformationType = <State: Object, Payload, Meta>(
  ImplicitTransformation<State, Payload, Meta>,
) => Transformation<State, Payload, Meta>;

export type ImplicitTransformation<State: Object, Payload, Meta> =
  | Reducer<State, Action<Payload, Meta>>
  | Transformation<State, Payload, Meta>;

export type ModuleCreator<State: Object, IMap: {}> = (
  options: CreateModuleOptions<State, IMap>,
  enhancer?: ModuleEnhancer<State, IMap>,
) => ReduxModule<State, $ObjMap<IMap, ExtractActionCreatorType>>;

export type ModuleEnhancer<State: Object, IMap: {}> = (
  next: ModuleCreator<State, IMap>,
) => ModuleCreator<State, IMap>;

export type ReducerMap<State> = Map<string, Reducer<State, Action<any, any>>>;

export type ReduxModule<State: Object, AMap> = {
  actionCreators: AMap,
  name: string,
  reducer: Reducer<State, {type: string}>,
  types: $ObjMap<AMap, () => string>,
};

export type Transformation<State: Object, Payload, Meta> = {
  reducer: Reducer<State, Action<Payload, Meta>>,
};
