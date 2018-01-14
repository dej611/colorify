/* @flow */
import { isDefined, isString, isFunction } from './util.js';

// Generic function to validate a specific type
const validator = (oldOptions, defaults, check, ifPasses) => {
  return Object.keys(defaults).reduce((options, field) => {
    options[field] = check(oldOptions[field])
      ? ifPasses(oldOptions[field])
      : defaults[field];
    return options;
  }, {});
};

// Util functions to manipulate the ensure the original values
const castToBoolean = value => !!value;
const sameValue = value => value;

// Public API of the module
export default (options, types) => {
  const booleans = validator(options, types.booleans, isDefined, castToBoolean);
  const strings = validator(options, types.strings, isString, sameValue);
  const functions = validator(options, types.functions, isFunction, sameValue);

  // now merge all together
  return { ...options, ...booleans, ...strings, ...functions };
};

export const validateStrategy = (options, strategies) => {
  const value = options.strategy;
  const defaultFn = strategies.average;
  // If not defined pass the default
  if (!value) {
    return defaultFn;
  }
  // If it's a string, check if it is a known strategy or pass the default
  if (isString(value)) {
    return strategies[value] || defaultFn;
  }
  // Else, either is a function (and use it) or pass the default
  return isFunction(value) ? value : defaultFn;
};
