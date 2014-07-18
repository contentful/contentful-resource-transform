'use strict';

module.exports = createTransform;

var Promise = require('bluebird');
var map = require('map-sync');
var xtend = require('xtend');

module.exports = createTransform;

function createTransform (converters) {
  if (typeof converters === 'function') {
    converters = {
      Entry: converters,
      Asset: converters,
      ContentType: converters
    };
  }

  return transform;

  function transform (resource) {
    if (resource.sys.type === 'Array') {
      return Promise.join(
        convertResources(resource.items),
        Promise.props(map(resource.includes || {}, convertResources))
      ).spread(function (items, includes) {
        return xtend(resource, { items: items, includes: includes });
      });
    }

    if (resource.sys.type in converters) {
      return Promise.resolve(converters[resource.sys.type].apply(null, arguments));
    } else {
      return Promise.resolve(resource);
    }
  }

  function convertResources (array) {
    return Promise.map(array, transform);
  }
}
