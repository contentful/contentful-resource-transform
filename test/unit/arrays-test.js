'use strict';
var buster = require('buster');
var describe = buster.spec.describe;
var it = buster.spec.it;
var assert = buster.assert;

var createTransform = require('../../');

describe('transforming array resources', function () {

  var collapseToIds = createTransform(function (resource) {
    return resource.sys.type + '!' + resource.sys.id;
  });

  it('Transforms all items and includes in an Array resource', function () {
    return collapseToIds({
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
    }).then(function (result) {
      assert.equals(result, {
        sys: { type: 'Array' },
        items: [ 'Entry!Whatever' ],
        includes: {
          ContentType: [ 'ContentType!Yeah' ]
        }
      });
    });
  });
});
