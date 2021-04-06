module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "google", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 2017,
  },
  rules: { "require-jsdoc": 0 },
};
