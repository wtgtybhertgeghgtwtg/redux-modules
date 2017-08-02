// @flow
import {snakeCase} from 'lodash';

/**
 * @private
 * Uppercase and snakecase the given string.
 * @param  {string} type The string to be formatted.
 * @return {string} A formatted version of 'type'.
 */
function anaconda(type) {
  return snakeCase(type).toUpperCase();
}

/**
 * @private
 * @example
 * // Returns `EXAMPLE/SOME_ACTION`.
 * formatType('example', 'someAction');
 * @example
 * Creates a formatted type.
 * @param  {string} name The `name` of the parent ReduxModule.
 * @param  {string} actionName The name of the key the type will be stored under.
 * @return {string} The formatted type.
 */
export default function formatType(name: string, actionName: string) {
  return `${anaconda(name)}/${anaconda(actionName)}`;
}
