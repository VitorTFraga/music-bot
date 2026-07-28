const js = require('@eslint/js');

module.exports= [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs', // Importante já que seu projeto usa require/module.exports
      globals: {
        // Libera todas as variáveis globais nativas do Node.js (incluindo require, module, __dirname, process, console, etc)
        ...require('globals').node,
        
        // Se precisar de alguma global específica do Discord.js ou timer, adicione aqui se necessário
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-use-before-define': 'error',
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single'],
    },
  },
];
