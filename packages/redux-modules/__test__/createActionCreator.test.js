// @flow
import {isFSA} from 'flux-standard-action';
import createActionCreator from '../src/createActionCreator';

describe('the action creator returned by `createActionCreator`', () => {
  const type = 'TEST/TEST_TYPE';
  const actionCreator = createActionCreator(type);

  it('returns an action if `payload` is not defined.', () => {
    const action = actionCreator();
    expect(isFSA(action)).toBe(true);
    expect(action.payload).not.toBeDefined();
    expect(action.meta).not.toBeDefined();
    expect(action.error).toBe(false);
  });

  it('returns an action if `payload` is defined.', () => {
    const payload = 'payload';
    const action = actionCreator(payload);
    expect(isFSA(action)).toBe(true);
    expect(action.payload).toBe(payload);
    expect(action.meta).not.toBeDefined();
    expect(action.error).toBe(false);
  });

  it('returns an action with `error` set to `true` if `payload` is an Error.', () => {
    const payload = new Error();
    const action = actionCreator(payload);
    expect(isFSA(action)).toBe(true);
    expect(action.payload).toBe(payload);
    expect(action.meta).not.toBeDefined();
    expect(action.error).toBe(true);
  });

  it('returns an action if `meta` is defined.', () => {
    const payload = 'payload';
    const meta = 'meta';
    const action = actionCreator(payload, meta);
    expect(isFSA(action)).toBe(true);
    expect(action.payload).toBe(payload);
    expect(action.meta).toBe(meta);
    expect(action.error).toBe(false);
  });
});
