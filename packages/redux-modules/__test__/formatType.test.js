// @flow
import formatType from '../src/formatType';

describe('formatType', () => {
  it('formats a type.', () => {
    const type = formatType('some-Module', 'someActionName');
    expect(type).toEqual('SOME_MODULE/SOME_ACTION_NAME');
  });
});
