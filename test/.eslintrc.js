module.exports = {
  env: {
    mocha: true
  },
  rules: {
    // Override to allow proper describe / it structure
    "max-nested-callbacks": [2, 5]
  }
};
