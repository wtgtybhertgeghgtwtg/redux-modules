// @flow
import type {ActionCreator} from './types';

/**
 * @private
 * Create an ActionCreator for the given type.
 * @param {string} type The `type` the Action created by the ActionCreator will have.
 * @return {ActionCreator} The created ActionCreator.
 */
export default function createActionCreator<Payload, Meta>(
  type: string,
): ActionCreator<Payload, Meta> {
  return function actionCreator(payload, meta) {
    return {
      error: payload instanceof Error,
      meta,
      payload,
      type,
    };
  };
}
