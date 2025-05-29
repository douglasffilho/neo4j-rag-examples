import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import nodePlugin from 'eslint-plugin-n';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  nodePlugin.configs['flat/recommended-script'],
  ...tseslint.configs.recommended,
  ...[
    {
      rules: {
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'n/no-process-env': ['error'],
        'n/no-unsupported-features/node-builtins': ['warn'],
        'n/no-missing-import': [0]
      }
    },
    prettier,
    {
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        globals: {
          ...globals.node
        }
      }
    },
    {
      ignores: ['bin/', 'eslint.config.mjs', 'prettier.config.mjs']
    }
  ]
);
