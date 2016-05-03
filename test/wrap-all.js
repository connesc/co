
var assert = require('assert');

var co = require('..');

describe('co.wrapAll({ fn* })', function () {
  it('should wrap all generator functions', function () {
    var obj = {
      foo: function* (val) {
        return yield Promise.resolve(val);
      },
      bar: function* (val) {
        return val;
      },
      baz: function (val) {
        return val;
      }
    };

    co.wrapAll(obj);

    return co(function* () {
      yield obj.foo(1).then(function (val) {
        assert.equal(1, val);
      });

      yield obj.bar(2).then(function (val) {
        assert.equal(2, val);
      });

      assert.equal(3, obj.baz(3));
    });
  })

  it('should wrap non-enumerable properties', function () {
    var obj = {
      foo: function* (val) {
        return yield Promise.resolve(val);
      }
    };

    Object.defineProperty(obj, 'foo', {enumerable: false});

    co.wrapAll(obj);

    return obj.foo(42).then(function (val) {
      assert.equal(42, val);
    });
  })

  it('should return the wrapped object', function () {
    var obj = {
      foo: function* () {}
    };

    assert.equal(obj, co.wrapAll(obj));
  })
})
