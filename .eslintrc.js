// @flow

// "Inspired by" Jest's `.eslintrc.js`
module.exports = {
  extends: ['fb-strict', 'plugin:import/errors'],
  parser: 'babel-eslint',
  rules: {
    'computed-property-spacing': 0,
    'flowtype/boolean-style': 2,
    'flowtype/no-primitive-constructor-types': 2,
    'flowtype/require-valid-file-annotation': 2,
    'max-len': 0,
    'no-multiple-empty-lines': 1,
    'import/no-duplicates': 2,
    'import/no-unresolved': [2, {ignore: ['^@wtg/']}],
    'import/named': 0,
    'require-jsdoc': [
      2,
      {
        require: {
          ArrowFunctionExpression: false,
          ClassDeclaration: true,
          FunctionDeclaration: true,
          MethodDefinition: false,
        },
      },
    ],
    'valid-jsdoc': 2,
  },
  plugins: ['import'],
};
