'use strict';

const internals = {};

internals.Assertion = (check, errorMessage) => {

  return (input, assert) => {

    const isTrue = !!check(input);
    if (isTrue)
      return input || true;

    if (!assert)
      return false;

    throw new Error(`"${typeof assert !== 'string' ? 'input' : assert}" ${errorMessage}`);
  };
};


export const assert = (condition, message) => {

  if (condition)
    return condition;

  throw new Error(message);
};

export const noop = () => {};
export const isEqualTo = (value, message = 'is not equal to value') => internals.Assertion(input => input === value, message);
export const isTrue = isEqualTo(true, 'must be true');
export const isUndefined = isEqualTo(void 0, 'must be undefined');
export const isRequired = internals.Assertion(input => !!input, 'is required');
export const isInstanceOf = type => internals.Assertion(input => input instanceof type, `is not an instance of ${type.name}`);
export const isArray = isInstanceOf(Array);
export const isObject = internals.Assertion(input => typeof input === 'object', 'must be an object');
export const isString = internals.Assertion(input => typeof input === 'string', 'must be a string');
export const isFunction = internals.Assertion(input => typeof input === 'function', 'must be a function');
export const isNumber = internals.Assertion(input => typeof input === 'number', 'must be a number');
export const isInteger = internals.Assertion(input => Number.isInteger(input), 'must be an integer');


export const isElement = internals.Assertion(object => {

  if (!object || typeof object !== "object")
    return false;

  if (typeof HTMLElement === "object" )
    return object instanceof HTMLElement;

  return object.nodeType === 1 && typeof object.nodeName === "string";
}, 'must be a HTMLElement');

export const round = (value, decimals) => {

  isNumber(value, 'value');

  isRequired(decimals, 'decimals');
  isInteger(decimals, 'decimals');

  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};