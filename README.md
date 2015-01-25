# hll
[![Build Status][travis-image]][travis-url]

*hll* implements [HyperLogLog][whitepaper], a near-optimal distinct value (cardinality) estimator.

With a single parameter, the bit sample size, HyperLogLog boasts an easily derivable memory footprint and fixed relative error. As you increase the algorithm's memory footprint, it's relative error  decreases dramatically.

This implementation's acceptable bit sample sizes fall within the range `[4, 12]`. This allows you to customize the algorithm's relative error between 1.625% and 26%. Each register is an instance of the [Buffer class][nodebuffer].

|Bit Sample Size|Number of Registers|Relative Error|
|---------------|-------------------|--------------|
|4              |16                 |26%
|5              |32                 |18.385%
|6              |64                 |13%
|7              |128                |9.192%
|8              |256                |6.5%
|9              |512                |4.596%
|10             |1024               |3.25%
|11             |2048               |2.298%
|12             |4096               |1.625%

## HyperLogLog Reference
`Number of Registers` = `2^(Bit Sample Size)`

`Memory Footprint` = ~`Number of Registers` * `Size of Register`

`Relative Error` = `1.04` / `Math.sqrt(Number of Registers)`

## Usage
```js
> var hll = require('hll');

// initialize a new hyperloglog data structure with a bit sample size
> var h = hll(12);

// check out your relative error
> h.relativeError
0.01625

// insert some values
> ['1', '2', '3', '4', '1', '2'].forEach(h.insert);

// crunch the numbers
h.estimate();
> 4

// then insert some more numbers and crunch them again!
```

## API Specification

### hll(*bitSampleSize*)

Returns a new instance of a HyperLogLog data structure. Acceptable values for *bitSampleSize* are integers that fall within the range `[4, 12]`.

If unacceptable input is provided, a `RangeError` is thrown.

### Data Structure Methods

#### myHll.insert(*value*)

Insert a value. This value **must** be a string. Returns a summary of the operation.

If unacceptable input is provided, a `TypeError` is thrown.

This implementation uses 128-bit [MurmurHash3][murmurhash], a fast, non-cryptographic hash function.

#### myHll.estimate()

Iterates over the data structure's registers and returns the estimated cardinality of the data set.

#### myHll.relativeError

Fetch the data structure's constant relative error.


[whitepaper]: http://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf
[nodebuffer]: http://nodejs.org/api/buffer.html
[murmurhash]: http://en.wikipedia.org/wiki/MurmurHash
[travis-image]: https://img.shields.io/travis/davidgwking/hll.svg?style=flat&branch=master
[travis-url]: https://travis-ci.org/davidgwking/hll
