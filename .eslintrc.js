// @flow

module.exports = {
  'extends': [
    'fb-strict',
    'plugin:import/errors'
  ],
  'parser': 'babel-eslint',
  'rules': {
    'computed-property-spacing': 0,
    'flowtype/boolean-style': 2,
    'flowtype/no-primitive-constructor-types': 2,
    'flowtype/require-valid-file-annotation': 2,
    'max-len': 0,
    'no-multiple-empty-lines': 1,
    'import/no-duplicates': 2,
    'import/no-unresolved': [2, { 'ignore': ['^types/'] }],
    // This has to be disabled until all type and module imports are combined
    // https://github.com/benmosher/eslint-plugin-import/issues/645
    'import/order': 0,
    // These has to be disabled until the whole code base is converted to ESM
    'import/default': 0,
    'import/named': 0,
  },
  'plugins': [
    'markdown',
    'import'
  ]
};
