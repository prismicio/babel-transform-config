module.exports = {
  root: true,
  env: {
    browser: false,
    node: true
  },
  parser: 'babel-eslint',
  extends: ['plugin:prettier/recommended'],
  plugins: [],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-undef': 0,
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    semi: ['error', 'always']
  }
};
