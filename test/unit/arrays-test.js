'use strict';
const buster = require('buster');
const describe = buster.spec.describe;
const it = buster.spec.it;
const assert = buster.assert;

const createTransform = require('../../');

describe('transforming array resources', function () {
  const collapseToIds = createTransform(function (resource) {
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
        items: ['Entry!Whatever'],
        includes: {
          ContentType: ['ContentType!Yeah']
        }
      });
    });
  });

  it('Does not add a new includes property for Arrays', function () {
    return collapseToIds({
      sys: { type: 'Array' },
      items: [
        {
          sys: { type: 'Entry', id: 'Whatever' }
        }
      ]
    }).then(function (result) {
      assert.equals(result, {
        sys: { type: 'Array' },
        items: ['Entry!Whatever']
      });
    });
  });
});
