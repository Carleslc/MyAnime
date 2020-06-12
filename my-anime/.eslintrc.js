module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },

  env: {
    browser: true,
    es6: true,
    node: true,
  },

  extends: [
    // https://eslint.vuejs.org/rules/#priority-a-essential-error-prevention
    'plugin:vue/recommended',
    'airbnb-base',
    'prettier',
    'prettier/vue',
  ],

  // required to lint *.vue files
  plugins: ['prettier', 'vue'],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true,
  },

  // add your custom rules here
  rules: {
    'max-len': [
      'warn',
      {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],

    'prefer-destructuring': ['error', { object: true, array: false }],

    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-param-reassign': 'off',
    'global-require': 'off',
    'no-unused-vars': 'warn',

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',

    // allow console during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
