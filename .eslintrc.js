module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true,
    },
    plugins: ['vue', 'vuetify', '@typescript-eslint', 'prettier'],
    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:vue/base',
        'plugin:vuetify/base',
        'plugin:vuetify/recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    rules: {
        'vue/no-unused-vars': 'error',
        'vue/script-setup-uses-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        'prettier/prettier': 'error',
        'grid-unknown-attributes': 'off',
    },
};
