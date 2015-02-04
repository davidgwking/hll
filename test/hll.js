var hll = require('../lib/hll');
var expect = require('chai').expect;

var MIN_BIT_SAMPLE_SZ = 4;

describe('hll', function () {

  describe('should export', function () {

    it('a function', function () {
      expect(hll).to.be.a('function');
    });

    it('and that function should provide an hll instance', function () {
      var h = hll({bitSampleSize: MIN_BIT_SAMPLE_SZ});

      expect(h).to.be.an('object');
      expect(h.insert).to.be.a('function');
      expect(h.estimate).to.be.a('function');
      expect(h.standardError).to.be.a('number');
    });

  }); // END: should export

  describe('instance api functions', function () {

    describe('insert', function () {

      describe('should accept string inputs', function () {

        it('when using the 32-bit digest variant', function () {
          var h = hll({bitSampleSize: MIN_BIT_SAMPLE_SZ, digestSize: 32});
          var insertion = h.insert('test');
          expect(insertion.hash).to.eql([3127628307]);
          expect(insertion.registerIndex).to.eql(3);
          expect(insertion.runOfZerosLength).to.eql(1);
          expect(insertion.registerValue).to.eql(1);
        });

        it('when using the 128-bit digest variant', function () {
          var h = hll({bitSampleSize: MIN_BIT_SAMPLE_SZ});
          var insertion = h.insert('test');
          expect(insertion.hash).to.eql([1862463280, 1426881896, 1426881896, 1426881896]);
          expect(insertion.registerIndex).to.eql(8);
          expect(insertion.runOfZerosLength).to.eql(2);
          expect(insertion.registerValue).to.eql(2);
        });

      }); // END: should accept string inputs

      describe('should accept empty string inputs', function () {

        it('when using the 32-bit digest variant', function () {
          var h = hll({bitSampleSize: MIN_BIT_SAMPLE_SZ, digestSize: 32});
          var insertion = h.insert('');
          expect(insertion.hash).to.eql([0]);
          expect(insertion.registerIndex).to.eql(0);
          expect(insertion.runOfZerosLength).to.eql(28);
          expect(insertion.registerValue).to.eql(28);
        });

        it('when using the 128-bit digest variant', function () {
          var h = hll({bitSampleSize: MIN_BIT_SAMPLE_SZ});
          var insertion = h.insert('');
          expect(insertion.hash).to.eql([0, 0, 0, 0]);
          expect(insertion.registerIndex).to.eql(0);
          expect(insertion.runOfZerosLength).to.eql(124);
          expect(insertion.registerValue).to.eql(124);
        });

      }); // END: should accept empty string inputs

      it('should throw a TypeError on non-string inputs', function () {
        var h = hll({bitSampleSize: MIN_BIT_SAMPLE_SZ});
        var values = [[], 5, true, {}, null];
        values.forEach(function (value) {
          expect(h.insert.bind(null, value)).to.throw(TypeError);
        });
      });

    }); // END: insert

    describe('estimate', function () {

      it('should estimate zero for zero inputs', function () {
        var h = hll({bitSampleSize: MIN_BIT_SAMPLE_SZ});
        expect(h.estimate()).to.eql(0);
      });

      it('should provide a cardinality estimate for very small data sets', function () {
        var h = hll();

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
        var h = hll();

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
