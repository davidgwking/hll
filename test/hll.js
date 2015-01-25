var hll = require('../lib/hll');
var expect = require('chai').expect;

var MIN_BIT_SAMPLE_SZ = 4;
var MAX_BIT_SAMPLE_SZ = 12;

describe('hll', function () {

  describe('should export', function () {
    it('a function', function () {
      expect(hll).to.be.a('function');
    });

    it('and that function should provide an hll instance', function () {
      var h = hll(MIN_BIT_SAMPLE_SZ);

      expect(h).to.be.an('object');
      expect(h.insert).to.be.a('function');
      expect(h.estimate).to.be.a('function');
      expect(h.relativeError).to.be.a('number');
    });
  }); // END: should export

  describe('instance api functions', function () {

    describe('insert', function () {
      it('should accept string inputs', function () {
        var h = hll(MIN_BIT_SAMPLE_SZ);
        var insertion = h.insert('test');
        expect(insertion.hash).to.eql([1958601117, 2893883596, 4189932930, 2584904241]);
        expect(insertion.registerIndex).to.eql(0);
        expect(insertion.runOfZerosLength).to.eql(1);
        expect(insertion.registerValue).to.eql(1);
      });

      it('should throw a TypeError on non-string inputs', function () {
        var h = hll(MIN_BIT_SAMPLE_SZ);
        var values = [new String(''), 5, true, {}, null];
        values.forEach(function (value) {
          expect(h.insert.bind(null, value)).to.throw(TypeError);
        });
      });
    }); // END: insert

    describe('estimate', function () {
      it('should estimate zero for zero inputs', function () {
        var h = hll(MIN_BIT_SAMPLE_SZ);
        expect(h.estimate()).to.eql(0);
      });

      it('should estimate within the bounds of the relative error constant', function () {
        var h = hll(MAX_BIT_SAMPLE_SZ);

        var data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'a'];
        data.forEach(function (val) {
          h.insert(val);
        });

        var errorThresholds = {
          upper: 7 * (1 + h.relativeError),
          lower: 7 * (1 - h.relativeError)
        };

        var e = h.estimate();
        expect(e).to.be.below(errorThresholds.upper);
        expect(e).to.be.above(errorThresholds.lower);
        expect(e).to.eql(7);
      });
    }); // END: estimate

  }); // END: instance api functions

}); // END: hll
