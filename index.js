'use strict';

module.exports = createTransform;

const Bluebird = require('bluebird');
const map = require('map-sync');
const xtend = require('xtend');
const compose = require('compose-promise');

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
    const extraArgs = Array.prototype.slice.call(arguments, 1);
    if (resource.sys.type === 'Array') {
      return Bluebird.join(
        convertResources(resource.items),
        convertIncludes(resource.includes)
      ).spread(function (items, includes) {
        resource = xtend(resource, { items: items });
        if (includes) {
          resource.includes = includes;
        }
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
  const combined = {};

  for (const type in f) {
    if (f.hasOwnProperty(type)) {
      combined[type] = g[type] ? compose(f[type], g[type]) : f[type];
    }
  }

  for (const type in g) {
    if (g.hasOwnProperty(type) && !combined[type]) {
      combined[type] = g[type];
    }
  }

  return combined;
}
