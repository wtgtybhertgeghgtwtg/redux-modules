// @flow
import {snakeCase} from 'lodash';

// Get it?  Because it's a big snake?  Ha.  Ha.  Ha.
function anaconda(type) {
  return snakeCase(type).toUpperCase();
}

export default function formatType(name: string, actionName: string) {
  return `${anaconda(name)}/${anaconda(actionName)}`;
}
