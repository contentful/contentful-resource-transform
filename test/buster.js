'use strict';

var config = module.exports;

config.unit = {
  environment: 'node',
  rootPath: '../',
  tests: [
    'test/unit/**/*-test.js'
  ]
};

config.integration = {
  environment: 'node',
  rootPath: '../',
  tests: [
    'test/integration/**/*-test.js'
  ]
};
