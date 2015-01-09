'use strict';

module.exports = createTransform;

var Bluebird = require('bluebird');
var map = require('map-sync');
var xtend = require('xtend');
var compose = require('compose-promise');

module.exports = createTransform;

function createTransform (converters) {
  converters = normalizeConverters(converters);

  transform.prepend = function (otherConverters) {
    return createTransform(
      composeConverters(converters, normalizeConverters(otherConverters))
    );
  };

  transform.append = function (otherConverters) {
    return createTransform(
      composeConverters(normalizeConverters(otherConverters), converters)
    );
  };

  return transform;

  function transform (resource) {
    var extraArgs = Array.prototype.slice.call(arguments, 1);
    if (resource.sys.type === 'Array') {
      return Bluebird.join(
        convertResources(resource.items),
        convertIncludes(resource.includes)
      ).spread(function (items, includes) {
        resource = xtend(resource, { items: items });
        if (includes) resource.includes = includes;
        return resource;
      });
    }

    if (resource.sys.type in converters) {
      return Bluebird.resolve(converters[resource.sys.type].apply(null, arguments));
    } else {
      return Bluebird.resolve(resource);
    }

    function convertResources (array) {
      return Bluebird.map(array, function (item) {
        return transform.apply(null, [item].concat(extraArgs));
      });
    }

    function convertIncludes (includes) {
      if (!includes) {
        return Bluebird.resolve();
      } else {
        return Bluebird.props(map(resource.includes, convertResources));
      }
    }
  }
}

function normalizeConverters (converters) {
  if (typeof converters === 'function') {
    return {
      Entry: converters,
      Asset: converters,
      ContentType: converters
    };
  } else {
    return converters;
  }
}

function composeConverters (f, g) {
  var combined = {};

  for (var type in f) {
    combined[type] = g[type] ? compose(f[type], g[type]) : f[type];
  }

  for (var type in g) {
    if (!combined[type]) {
      combined[type] = g[type];
    }
  }

  return combined;
}
