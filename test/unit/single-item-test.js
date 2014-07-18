'use strict';
var Promise = require('bluebird');

var buster = require('buster');
var describe = buster.spec.describe;
var it = buster.spec.it;
var assert = buster.assert;

var createTransform = require('../../');


describe('createTransform', function () {

  describe('from a function', function () {
    var transform = createTransform(function (resource) {
      return resource.sys.type;
    });

    ['Entry', 'Asset', 'ContentType'].forEach(function (type) {
      var resource = { sys: { type: type } };

      it('Transforms a ' + type + ' resource', function () {
        return transform(resource).then(function (result) {
          assert.equals(type, result);
        });
      });

    });

    itIgnoresUnknownTypes(transform);
  });

  describe('from an object', function () {
    var transform = createTransform({
      Entry: function () { return 'It was an entry'; },
      Asset: function () { return 'It was an asset'; },
      ContentType: function () { return 'It was a content type'; }
    });

    itIgnoresUnknownTypes(transform);

    it('uses the appropriate type for each transform', function () {
      return Promise.join(
        transform({ sys: { type: 'Entry' }}).then(function (result) {
        assert.equals(result, 'It was an entry');
        }),
        transform({ sys: { type: 'Asset' }}).then(function (result) {
          assert.equals(result, 'It was an asset');
        }),
        transform({ sys: { type: 'ContentType' }}).then(function (result) {
          assert.equals(result, 'It was a content type');
        })
      );
    });
  });
});

function itIgnoresUnknownTypes (transform) {
  it('Ignores unknown types', function () {
    return transform({ sys: { type: 'Foobar' } }).then(function (result) {
      assert.isObject(result);
      assert.equals(result.sys, { type: 'Foobar' });
    });
  });
}
