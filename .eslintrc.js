module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true,
    },
    plugins: ['vue', 'vuetify', '@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:vue/base',
        'plugin:vue/vue3-recommended',
        'plugin:vuetify/base',
        'plugin:vuetify/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    rules: {
        'vue/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        'grid-unknown-attributes': 'off', // vuetify
    },
};
