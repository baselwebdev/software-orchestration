module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        "eslint:recommended",
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
    ],
    rules: {
        'sort-imports': 1,
        '@typescript-eslint/array-type': 1,
        '@typescript-eslint/class-literal-property-style': [1, 'getters'],
        '@typescript-eslint/consistent-indexed-object-style': 1,
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-imports': 1,
        '@typescript-eslint/naming-convention': [
            'error',
            { selector: 'variableLike', format: ['camelCase'] },
        ],
        '@typescript-eslint/no-confusing-non-null-assertion': 1,
        '@typescript-eslint/no-confusing-void-expression': 1,
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 1,
        '@typescript-eslint/no-unnecessary-type-arguments': 1,
        '@typescript-eslint/prefer-enum-initializers': 1,
        '@typescript-eslint/prefer-for-of': 1,
        '@typescript-eslint/prefer-includes': 1,
        '@typescript-eslint/prefer-literal-enum-member': 1,
        '@typescript-eslint/prefer-nullish-coalescing': 1,
        '@typescript-eslint/prefer-optional-chain': 1,
        '@typescript-eslint/prefer-string-starts-ends-with': 1,
        '@typescript-eslint/prefer-ts-expect-error': 1,
        '@typescript-eslint/promise-function-async': 1,
        '@typescript-eslint/require-array-sort-compare': 1,
        '@typescript-eslint/strict-boolean-expressions': 1,
        '@typescript-eslint/switch-exhaustiveness-check': 1,
        '@typescript-eslint/type-annotation-spacing': 1,
        '@typescript-eslint/no-empty-interface': 0,
        // Define the rule for typescript new statements types, interfaces etc when typescript eslint
        // adds the support for it.
        'padding-line-between-statements': [
            'warn',
            { blankLine: 'always', prev: '*', next: 'return' },
            { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
            { blankLine: 'never', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
            { blankLine: 'always', prev: 'import', next: '*' },
            { blankLine: 'never', prev: 'import', next: 'import' },
        ],
    },
};
