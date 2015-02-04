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

  }); // END: should export

  describe('instance api functions', function () {

    describe('value', function () {

      it('should be an array of 1 32-bit unsigned integers when using the 32-bit digest variant', function () {
        var value = hash('test', {digestSize: 32}).value;
        expect(value).to.be.an.instanceof(Array);
        expect(value).to.have.length(1);
        value.forEach(function (val) {
          expect(val).to.be.above(0);                     // Min 32 bit unsigned int
          expect(val).to.be.below(4294967295);            // Max 32bit unsigned int
          expect(val % 1).to.eql(0);
        });
      });

      it('should be an array of 4 32-bit unsigned integers when using the 128-bit digest variant', function () {
        var value = hash('test').value;
        expect(value).to.be.an.instanceof(Array);
        expect(value).to.have.length(4);
        value.forEach(function (val) {
          expect(val).to.be.above(0);                     // Min 32 bit unsigned int
          expect(val).to.be.below(4294967295);            // Max 32bit unsigned int
          expect(val % 1).to.eql(0);
        });
      });

    }); // END: value

    describe('getLSBs', function () {

      describe('should return the value of the first n least significant bits', function () {

        it('when using the 32-bit digest variant', function () {
          var hashed = hash('test', {digestSize: 32});      // [0] == 3127628307 == 10111010011010111101001000010011 == LSBs
          expect(hashed.getLSBs(0)).to.eql(0);              // ? == 0
          expect(hashed.getLSBs(5)).to.eql(19);             // 10011 == 19
          expect(hashed.getLSBs(10)).to.eql(531);           // 1000010011 == 531
          expect(hashed.getLSBs(15)).to.eql(21011);         // 101001000010011 == 21011
          expect(hashed.getLSBs(20)).to.eql(774675);        // 10111101001000010011 == 774675
          expect(hashed.getLSBs(32)).to.eql(3127628307);    // 10111010011010111101001000010011 == 3127628307
        });

        it('when using the 128-bit digest variant', function () {
          var hashed = hash('test');                        // [3] == 1426881896 == 01010101000011000111110101101000 == LSBs
          expect(hashed.getLSBs(0)).to.eql(0);              // ? == 0
          expect(hashed.getLSBs(5)).to.eql(8);              // 01000 == 8
          expect(hashed.getLSBs(10)).to.eql(360);           // 0101101000 == 816
          expect(hashed.getLSBs(15)).to.eql(32104);         // 111110101101000 == 28464
          expect(hashed.getLSBs(20)).to.eql(818536);        // 11000111110101101000 == 818536
          expect(hashed.getLSBs(32)).to.eql(1426881896);    // 01010101000011000111110101101000 == 1426881896
        });

      }); // END: should return the value of the first n least significant bits

      it('should return -1 on invalid input', function () {
        var hashed = hash('test');
        expect(hashed.getLSBs(-1)).to.eql(-1);
        expect(hashed.getLSBs(33)).to.eql(-1);
      });

    }); // END: getLSBs

    describe('getDistanceToNext1', function () {

      describe('should fetch the distance between the nth bit and the next MSB that holds the value of 1', function () {

        it('when using the 32-bit digest variant', function () {
          var hashed = hash('testString12345', {digestSize: 32}); // [0] == 2047633314 == 1111010000011000110011110100010
          expect(hashed.getDistanceToNext1(0)).to.eql(2);
          expect(hashed.getDistanceToNext1(2)).to.eql(4);
          expect(hashed.getDistanceToNext1(16)).to.eql(3);
          expect(hashed.getDistanceToNext1(32)).to.eql(0);
        });

        it('when using the 128-bit digest variant', function () {
          var hashed = hash('testString12345'); // [3] == 1955578016 == 01110100100011111100000010100000 == LSBs
                                                // [2] == 2582602129 == 10011001111011110110000110010001
                                                // [1] == 1434417628 == 01010101011111110111100111011100
                                                // [0] == 815612411  == 00110000100111010100000111111011 == MSBs
          expect(hashed.getDistanceToNext1(0)).to.eql(6);
          expect(hashed.getDistanceToNext1(6)).to.eql(2);
          expect(hashed.getDistanceToNext1(8)).to.eql(7);
          expect(hashed.getDistanceToNext1(32)).to.eql(1);
          expect(hashed.getDistanceToNext1(33)).to.eql(4);
          expect(hashed.getDistanceToNext1(37)).to.eql(3);
          expect(hashed.getDistanceToNext1(41)).to.eql(5);
          expect(hashed.getDistanceToNext1(64)).to.eql(3);
          expect(hashed.getDistanceToNext1(65)).to.eql(2);
          expect(hashed.getDistanceToNext1(96)).to.eql(1);
          expect(hashed.getDistanceToNext1(97)).to.eql(1);
          expect(hashed.getDistanceToNext1(125)).to.eql(1);
          expect(hashed.getDistanceToNext1(127)).to.eql(1);
          expect(hashed.getDistanceToNext1(128)).to.eql(0);
        });

      }); // END: should fetch the distance between the nth bit and the next MSB that holds the value of 1

      describe('should return -1 on invalid input', function () {

        it('when using the 32-bit digest variant', function () {
          var hashed = hash('test', {digestSize: 32});
          expect(hashed.getDistanceToNext1(-1)).to.eql(-1);
          expect(hashed.getDistanceToNext1(33)).to.eql(-1);
        });

        it('when using the 128-bit digest variant', function () {
          var hashed = hash('test');
          expect(hashed.getDistanceToNext1(-1)).to.eql(-1);
          expect(hashed.getDistanceToNext1(129)).to.eql(-1);
        });

      }); // END: should return -1 on invalid input

    }); // END: getDistanceToNext1

  }); // END: instance api functions

}); // END: hash
