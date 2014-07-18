'use strict';
var Promise = require('bluebird');

var buster = require('buster');
var describe = buster.spec.describe;
var it = buster.spec.it;
var assert = buster.assert;

var createTransform = require('../../');

describe('transforming array resources', function () {

  var arrayResource = {
    sys: { type: 'Array' },
    items: [
      {
        sys: { type: 'Entry', id: 'Whatever' }
      }
    ],
    includes: {
      ContentType: [
        {
          sys: { type: 'ContentType', id: 'Yeah' }
        }
      ]
    }
  };

  var transform = createTransform(function (resource) {
    return resource.sys.type + '!' + resource.sys.id;
  });

  return transform(arrayResource).then(function (result) {
    assert.equals(result, {
      sys: { type: 'Array' },
      items: [ 'Entry!Whatever' ],
      includes: {
        ContentType: [ 'ContentType!Yeah' ]
      }
    });
  });
});
