# contentful-resource-transform

Apply transforms to Contentful resources or collections thereof.

## Synopsis

Create a transform function by passing the function you want to apply to each resource to `createTransform`.

```javascript
var assert = require('assert');
var createTransform = require('./');

var collapseToId = createTransform(function (resource) {
  // could also return a promise here
  return resource.sys.type + '!' + resource.sys.id;
});
```

`collapseToId` will accept any "Entry", "Asset", and "ContentType" resources it finds with the provided function:

```javascript
collapseToId({ sys: { type: 'Entry', id: 'blah' } }).then(function (result) {
  assert.equal(result, 'Entry!blah');
}).done();
```
 _(note that we're only providing the bare minimum for our transform to work,
 resources returned by the Contentful API's have many more properties)_

### Transforming Arrays

If a resource is an "Array" `collapseToId` will traverse it's `items` and `includes` properties:

```javascript
collapseToId({
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
}).then(function (collapsed) {
  require('assert').deepEqual(collapsed, {
    sys: { type: 'Array' },
    items: [ 'Entry!Whatever' ],
    includes: {
      ContentType: [ 'ContentType!Yeah' ]
    }
  });
}).done();
```

## License

MIT
