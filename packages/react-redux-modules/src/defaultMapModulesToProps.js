// @flow
import type {ActionCreator, ReduxModule} from '@wtg/redux-modules';
// import type {MapDispatchToProps} from 'react-redux';
// import type {MapModulesToProps} from './types';

/**
 * @private
 * The default mapModulesToProps function.  It's just all of the actionCreators of `modules` spread together.
 * @param {Array<ReduxModule>} modules Modules whose actionCreators will be passed as props to the component.
 * @return {Object} The combined actionCreators from `modules`.
 */
export default function defaultMapModulesToProps(
  modules: Array<ReduxModule<Object, $Shape<*>>>,
): {[name: string]: ActionCreator<any, any>} {
  const actionCreators = modules.map(
    <A: {[name: string]: ActionCreator<any, any>}>(
      reduxModule: ReduxModule<Object, A>,
    ) => reduxModule.actionCreators,
  );
  return Object.assign({}, ...actionCreators);
}
