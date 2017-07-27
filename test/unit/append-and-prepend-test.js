'use strict';
const callMethod = require('call-method');
const assert = require('chai').assert;

const createTransform = require('../../');

const toArray = function (resource) {
  return [resource.sys.type, resource.sys.id];
};
const toString = function (resource) {
  return resource.sys.type + ': ' + resource.sys.id;
};
const toUpperCase = callMethod('toUpperCase');

describe('appending transforms', function () {
  const toUpperCaseString = createTransform(toString).append(toUpperCase);

  it('runs the appended transform last', function () {
    return toUpperCaseString({ sys: { type: 'Entry', id: 'hello' } }).then(function (string) {
      assert.deepEqual(string, 'ENTRY: HELLO');
    });
  });
});

describe('prepending transforms', function () {
  const toUpperCaseString = createTransform(toUpperCase).prepend(toString);

  it('runs the prepended transform first', function () {
    return toUpperCaseString({ sys: { type: 'Entry', id: 'hello' } }).then(function (string) {
      assert.deepEqual(string, 'ENTRY: HELLO');
    });
  });
});

describe('chaining transforms', function () {
  // complex example, creates a transform that goes toArray -> join -> toUpperCase
  const toUpperCaseString =
    createTransform(callMethod('join', ': '))
      .prepend(toArray)
      .append(toUpperCase);

  it('runs all the transforms in correct order', function () {
    return toUpperCaseString({ sys: { type: 'Entry', id: 'hello' } }).then(function (string) {
      assert.deepEqual(string, 'ENTRY: HELLO');
    });
  });
});
