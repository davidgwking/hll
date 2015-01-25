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
      expect(h.standardError).to.be.a('number');
    });
  }); // END: should export

  describe('instance api functions', function () {

    describe('insert', function () {
      it('should accept string inputs', function () {
        var h = hll(MIN_BIT_SAMPLE_SZ);
        var insertion = h.insert('test');
        expect(insertion.hash).to.eql([1862463280, 1426881896, 1426881896, 1426881896]);
        expect(insertion.registerIndex).to.eql(7);
        expect(insertion.runOfZerosLength).to.eql(2);
        expect(insertion.registerValue).to.eql(2);
      });

      it('should throw a TypeError on non-string inputs', function () {
        var h = hll(MIN_BIT_SAMPLE_SZ);
        var values = [[], 5, true, {}, null];
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

      it('should provide a cardinality estimate for very small data sets', function () {
        var h = hll(MAX_BIT_SAMPLE_SZ);

        var data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'a'];
        var uniqueData = [];
        data.forEach(function (val) {
          if (uniqueData.indexOf(val) === -1) uniqueData.push(val);
          h.insert(val);
        });

        var e = h.estimate();
        expect(e).to.be.ok;
      });

      it('should provide a cardinality estimate for data sets on the order of thousands of elements', function () {
        var h = hll(MAX_BIT_SAMPLE_SZ);

        var data = require('./assets/cities.json');
        var uniqueData = [];
        data.forEach(function (val) {
          if (uniqueData.indexOf(val) === -1) uniqueData.push(val);
          h.insert(val);
        });

        var e = h.estimate();
        expect(e).to.be.ok;
      });
    }); // END: estimate

  }); // END: instance api functions

}); // END: hll
