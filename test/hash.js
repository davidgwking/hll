var hash = require('../lib/hash');
var expect = require('chai').expect;

describe('hash', function () {

  describe('should export', function () {
    it('should export a function', function () {
      expect(hash).to.be.a('function');
    });

    it('and that function should return a hash instance', function () {
      var hashed = hash('test');

      expect(hashed).to.be.a('object');
      expect(hashed.value).to.be.an.instanceof(Array);
      expect(hashed.getDistanceToNext1).to.be.a('function');
      expect(hashed.getLSBs).to.be.a('function');
    });
  });

  describe('instance api functions', function () {

    describe('value', function () {
      it('should be an array of 4 32-bit unsigned integers', function () {
        var value = hash('test').value;
        expect(value).to.be.an.instanceof(Array);
        expect(value).to.have.length(4);
        value.forEach(function (val) {
          expect(val).to.be.above(0); // Min 32 bit unsigned int
          expect(val).to.be.below(4294967295); // Max 32bit unsigned int
          expect(val % 1).to.eql(0);
        });
      });
    }); // END: value

    describe('getLSBs', function () {
      it('should return the value of the first n least significant bits', function () {
        var hashed = hash('test');
        var value = hashed.value; // [3] == 2584904241 == 10011010000100101000001000110001 == LSBs
                                  // [0] == 1958601117 == 01110100101111011110000110011101 == MSBs
        expect(hashed.getLSBs(0)).to.eql(0);              // ? == 0
        expect(hashed.getLSBs(5)).to.eql(17);             // 10001 == 17
        expect(hashed.getLSBs(10)).to.eql(561);           // 1000110001 == 561
        expect(hashed.getLSBs(15)).to.eql(561);           // 000001000110001 == 561
        expect(hashed.getLSBs(20)).to.eql(164401);        // 00101000001000110001 == 164401
        expect(hashed.getLSBs(32)).to.eql(2584904241);    // 10011010000100101000001000110001 == 2584904241
      });

      it('should return -1 on invalid input', function () {
        var hashed = hash('test');
        expect(hashed.getLSBs(-1)).to.eql(-1);
        expect(hashed.getLSBs(33)).to.eql(-1);
      });
    }); // END: getLSBs

    describe('getDistanceToNext1', function () {
      it('should fetch the distance between the nth bit and the next MSB that holds the value of 1', function () {
        var hashed = hash('test');
        var value = hashed.value; // [3] == 2584904241 == 10011010000100101000001000110001 == LSBs
                                  // [0] == 1958601117 == 01110100101111011110000110011101 == MSBs
        expect(hashed.getDistanceToNext1(1)).to.eql(4);                 // n = 1, next = 5, distance = 4
        expect(hashed.getDistanceToNext1(5)).to.eql(1);                 // n = 5, next = 6, distance = 1
        expect(hashed.getDistanceToNext1(6)).to.eql(4);                 // n = 6, next = 10, distance = 4
        expect(hashed.getDistanceToNext1(10)).to.eql(6);                // n = 10, next = 16, distance = 6
        expect(hashed.getDistanceToNext1(32 + 32 + 32 + 5)).to.eql(3);  // n = 101, next = 104, distance = 3
        expect(hashed.getDistanceToNext1(32 + 32 + 32 + 32)).to.eql(0); // n = 128, next = ?, distance = 0
      });

      it('should return -1 on invalid input', function () {
        var hashed = hash('test');
        expect(hashed.getDistanceToNext1(-1)).to.eql(-1);
        expect(hashed.getDistanceToNext1(129)).to.eql(-1);
      });
    }); // END: getDistanceToNext1

  }); // END: instance api functions

}); // END: hash
