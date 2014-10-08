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
    var extraArgs = Array.prototype.slice.call(arguments, 1);
    if (resource.sys.type === 'Array') {
      return Promise.join(
        convertResources(resource.items),
        convertIncludes(resource.includes)
      ).spread(function (items, includes) {
        resource = xtend(resource, { items: items });
        if (includes) resource.includes = includes;
        return resource;
      });
    }

    if (resource.sys.type in converters) {
      return Promise.resolve(converters[resource.sys.type].apply(null, arguments));
    } else {
      return Promise.resolve(resource);
    }

    function convertResources (array) {
      return Promise.map(array, function (item) {
        return transform.apply(null, [item].concat(extraArgs));
      });
    }

    function convertIncludes (includes) {
      if (!includes) {
        return Promise.resolve();
      } else {
        return Promise.props(map(resource.includes, convertResources));
      }
    }
  }
}
