module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    'eslint-config-standard'
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  root: true,
  rules: {
    // 'semi': [2, 'never'],
    // quotes: ['error', 'single'],
    'for-direction': 'error',
    'getter-return': [
      'error',
      {
        allowImplicit: false
      }
    ],
    'no-await-in-loop': 'off',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': [
      'error',
      'except-parens'
    ],
    'no-console': 'off',
    'no-constant-condition': [
      'error',
      {
        checkLoops: false
      }
    ],
    'no-control-regex': 'error',
    'no-debugger': 'error',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error'
  }
}
