'use strict'; /*jslint es5: true, node: true, indent: 2 */

var containsFunctions = {
  /** containsFunctions[forward][inclusive] = function(number) { ... } */
  true: {
    // start <= end
    true: function(number) {
      return this.start <= number && number <= this.end;
    },
    false: function(number) {
      return this.start <= number && number < this.end;
    },
  },
  false: {
    // start >= end
    true: function(number) {
      return this.start >= number && number >= this.start;
    },
    false: function(number) {
      return this.start >= number && number > this.end;
    },
  },
};

var Range = exports.Range = function(start, end, inclusive) {
  /** new Range(start, end, inclusive): A basic range.

  Due to my silly little constructor level optimization, you should consider this structure immutable.

  start: Number
      The start of the range.
  end: Number
      The end of the range, can be less than or equal to start.
  inclusive: Boolean
      A Range(0, 5, inclusive=true) contains 5, but a Range(0, 5, inclusive=false) does not.
      Defaults to false.

      Think of it this way: inclusive includes *more*
      This only affects the `end` argument (i.e., Range(5, 0) always contains 5)
      If `start == end` and inclusive is false, the range contains nothing.
  */
  this.start = start;
  this.end = end;
  this.contains = containsFunctions[start < end][inclusive === undefined ? false : inclusive];
};
Range.fromTuple = function(tuple) {
  // can be either a 2-tuple `[start, end]`, or a 3-tuple `[start, end, inclusive]`
  return new Range(tuple[0], tuple[1], tuple[2]);
};
Range.fromTuples = function(tuples) {
  /** accepts only Range.fromTuples([tuple, tuple, ...]) syntax */
  return tuples.map(Range.fromTuple);
};

exports.fromPairs = function(range /*, range, range, ... */) {
  /** fromPairs(range, [range2, range3, ...]): helper to create new Range objects

  Accepts any of:
      fromPairs([21, 35])                    # case A
      fromPairs([21, 35], [70, 80], ...)     # case B
      fromPairs([[21, 35], [70, 80], ...])   # case C

  returns a flat list of Range objects
  */
  if (arguments.length <= 1 && Array.isArray(arguments[0][0])) {
    // handle case C, but don't confuse it with Case A
    return Range.fromTuples(arguments[0]);
  }
  else {
    var arguments_array = Array.prototype.slice.call(arguments);
    return Range.fromTuples(arguments_array);
  }
};

exports.anyContain = function(ranges, number) {
  return ranges.some(function(range) {
    return range.contains(number);
  });
};

exports.allContain = function(ranges, number) {
  return ranges.every(function(range) {
    return range.contains(number);
  });
};
