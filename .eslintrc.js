module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  "rules": {
    "semi": 2,
    "max-len": [2, {
      "code": 100
    }],
    "compat/compat": 2
  },
  "plugins": ["compat"],
  "extends": ["eslint:recommended", "google"]
};
