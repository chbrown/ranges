'use strict'; /*jslint es5: true, node: true, indent: 2 */
var assert = require('assert');
var ranges = require('./');

// basic module loading
assert.notEqual(ranges, undefined, 'ranges module should load from the current directory');

// non-inclusive (by default)
var nineteenth_century = new ranges.Range(1800, 1900);
assert.equal(nineteenth_century.contains(1900), false, 'nineteenth_century should not contain 1900');
assert.equal(nineteenth_century.contains(''), false, 'nineteenth_century should not contain the empty string');

// inclusive (by setting inclusive = true)
var modern_day = new ranges.Range(2000, 2010, true);
assert.equal(modern_day.contains(2010), true, 'nineteenth_century should not contain 1900');

// empty ranges
var empty_range = new ranges.Range(3400, 3400);
assert.equal(empty_range.contains(3400), false, 'empty_range should not contain anything');
assert.equal(empty_range.contains(3400.001), false, 'empty_range should not contain anything');
assert.equal(empty_range.contains(3399.999), false, 'empty_range should not contain anything');
assert.equal(empty_range.contains(''), false, 'empty_range should not contain the empty string');
assert.equal(empty_range.contains(), false, 'empty_range should not contain nothing');

// singleton ranges
var singleton_range = new ranges.Range(3400, 3400, true);
assert.equal(singleton_range.contains(3400), true, 'singleton_range should contain only 3400');
assert.equal(singleton_range.contains(3400.001), false, 'singleton_range should not contain anything except 3400');
assert.equal(singleton_range.contains(3400.001), false, 'singleton_range should not contain anything except 3400');
assert.equal(singleton_range.contains(-3400), false, 'singleton_range should not contain anything except 3400');

// reverse ranges
var reverse_range = new ranges.Range(3400, 3400, true);

// range lists
var valid_codes = ranges.fromPairs([[1800, 1900], [2005, 2010], [3400, 3400]]);

assert.equal(valid_codes.length, 3, 'valid_codes should be three ranges');
assert.equal(valid_codes[0] instanceof ranges.Range, true, 'first valid code (at least) should be a range');

assert.equal(ranges.anyContain(valid_codes, 1800), true, 'valid_codes should contain 1800');
assert.equal(ranges.anyContain(valid_codes, 'hyacinth'), false, 'valid_codes should not contain the string, "hyacinth"');

// range list specified as individual arguments
var owner_codes = ranges.fromPairs([1600, 1700], [9999, 9999], [-10, 10], [-100, 100]);
assert.equal(owner_codes.length, 4, 'owner_codes should be four ranges; even an empty Range is still a Range');

assert.equal(ranges.anyContain(owner_codes, 1600), true, 'owner_codes should contain 1600');
assert.equal(ranges.anyContain(owner_codes, 0), true, 'owner_codes should contain 0');
assert.equal(ranges.anyContain(owner_codes, 1700), false, 'owner_codes should not contain 1700');
assert.equal(ranges.anyContain(owner_codes, 9999), false, 'owner_codes should not contain 9999');

// range list specified as individual argument
var superuser_codes = ranges.fromPairs([8000, 8080]);
assert.equal(superuser_codes.length, 1, 'superuser_codes should be one range');
assert.equal(ranges.anyContain(superuser_codes, 8040), true, 'superuser_codes should contain 8040');
assert.equal(ranges.anyContain(superuser_codes, 8090), false, 'superuser_codes should not contain 8090');
assert.equal(ranges.anyContain(superuser_codes, 8080), false, 'superuser_codes should not contain 8080');
