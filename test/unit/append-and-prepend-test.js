'use strict';
var callMethod = require('call-method');
var buster = require('buster');
var describe = buster.spec.describe;
var it = buster.spec.it;
var assert = buster.assert;

var createTransform = require('../../');

var toArray = function (resource) { return [resource.sys.type, resource.sys.id] };
var toString = function (resource) { return resource.sys.type + ': ' + resource.sys.id };
var toUpperCase = callMethod('toUpperCase');

describe('appending transforms', function () {

  var toUpperCaseString = createTransform(toString).append(toUpperCase);

  it('runs the appended transform last', function () {
    return toUpperCaseString({ sys: { type: 'Entry', id: 'hello' } }).then(function (string) {
      assert.equals(string, 'ENTRY: HELLO');
    });
  });
});

describe('prepending transforms', function () {

  var toUpperCaseString = createTransform(toUpperCase).prepend(toString);

  it('runs the prepended transform first', function () {
    return toUpperCaseString({ sys: { type: 'Entry', id: 'hello' } }).then(function (string) {
      assert.equals(string, 'ENTRY: HELLO');
    });
  });
});

describe('chaining transforms', function () {

  // complex example, creates a transform that goes toArray -> join -> toUpperCase
  var toUpperCaseString =
    createTransform(callMethod('join', ': '))
    .prepend(toArray)
    .append(toUpperCase)

  it('runs all the transforms in correct order', function () {
    return toUpperCaseString({ sys: { type: 'Entry', id: 'hello' } }).then(function (string) {
      assert.equals(string, 'ENTRY: HELLO');
    });
  });
});
