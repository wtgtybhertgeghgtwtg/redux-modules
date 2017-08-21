// @flow
import type {ReduxModule} from '@wtg/redux-modules';
import type {MapDispatchToProps} from 'react-redux';
// import type {MapModulesToProps} from './types';

/**
 * @private
 * The default mapModulesToProps function.  It's just all of the actionCreators of `modules` spread together.
 * @param {Array<ReduxModule>} modules Modules whose actionCreators will be passed as props to the component.
 * @return {Object} The combined actionCreators from `modules`.
 */
export default function defaultMapModulesToProps<DP: Object>(
  modules: Array<ReduxModule<Object, $Shape<DP>, Object>>,
): MapDispatchToProps<*, *, DP> {
  const actionCreators = modules.map(
    <A: $Shape<DP>>(reduxModule: ReduxModule<*, A, *>) =>
      reduxModule.actionCreators,
  );
  return Object.assign({}, ...actionCreators);
}
