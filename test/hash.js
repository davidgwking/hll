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
        var hashed = hash('test'); // [3] == 1426881896 == 1010101000011000111110101101000 == LSBs
                                   // [0] == 1862463280 == 1101111000000101110111100110000 == MSBs/
        expect(hashed.getLSBs(0)).to.eql(0);              // ? == 0
        expect(hashed.getLSBs(5)).to.eql(8);              // 01000 == 8
        expect(hashed.getLSBs(10)).to.eql(360);           // 0101101000 == 816
        expect(hashed.getLSBs(15)).to.eql(32104);         // 111110101101000 == 28464
        expect(hashed.getLSBs(20)).to.eql(818536);        // 11000111110101101000 == 818536
        expect(hashed.getLSBs(32)).to.eql(1426881896);    // 1010101000011000111110101101000 == 1426881896
      });

      it('should return -1 on invalid input', function () {
        var hashed = hash('test');
        expect(hashed.getLSBs(-1)).to.eql(-1);
        expect(hashed.getLSBs(33)).to.eql(-1);
      });
    }); // END: getLSBs

    describe('getDistanceToNext1', function () {
      it('should fetch the distance between the nth bit and the next MSB that holds the value of 1', function () {
        var hashed = hash('test'); // [3] == 1426881896 == 1010101000011000111110101101000 == LSBs
                                   // [0] == 1862463280 == 1101111000000101110111100110000 == MSBs
        expect(hashed.getDistanceToNext1(0)).to.eql(4);                 // n = 0, next = 4, distance = 4
        expect(hashed.getDistanceToNext1(1)).to.eql(3);                 // n = 1, next = 4, distance = 3
        expect(hashed.getDistanceToNext1(5)).to.eql(1);                 // n = 5, next = 6, distance = 1
        expect(hashed.getDistanceToNext1(6)).to.eql(1);                 // n = 6, next = 7, distance = 1
        expect(hashed.getDistanceToNext1(10)).to.eql(1);                // n = 10, next = 11, distance = 1
        expect(hashed.getDistanceToNext1(32 + 32 + 32 + 5)).to.eql(1);  // n = 101, next = 102, distance = 1
        expect(hashed.getDistanceToNext1(32 + 32 + 32 + 32)).to.eql(128); // n = 128, next = ?, distance = 128
      });

      it('should return -1 on invalid input', function () {
        var hashed = hash('test');
        expect(hashed.getDistanceToNext1(-1)).to.eql(-1);
        expect(hashed.getDistanceToNext1(129)).to.eql(-1);
      });
    }); // END: getDistanceToNext1

  }); // END: instance api functions

}); // END: hash
