module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'user',
        'catalog',
        'inventory',
        'cart',
        'order',
        'payment',
        'notification',
        'gateway',
        'bff',
        'shared',
        'infra',
        'observability',
      ],
    ],
    'scope-empty': [0],
  },
};
