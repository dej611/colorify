/* @flow */
import average from './average';
import grayscale from './grayscale';

// Based on luminosity
const max = Math.max;
const min = Math.min;

// Put them together in an object now
export default {
  average,
  grayscale,
  max,
  min,
};
