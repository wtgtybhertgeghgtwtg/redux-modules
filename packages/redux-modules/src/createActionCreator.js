// @flow
import type {ActionCreator} from 'types/redux-modules';

// Really rolls off the tongue, huh?
export default function createActionCreator<P, M>(type: string) : ActionCreator<P, M> {
  return function actionCreator(payload?: P, meta?: M) {
    return {
      error: payload instanceof Error,
      meta,
      payload,
      type,
    };
  };
}
