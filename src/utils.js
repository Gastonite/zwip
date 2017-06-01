'use strict';

const internals = {};

internals.Checker = (check, errorMessage) => {

  return (input, assert) => {

    const isTrue = !!check(input);
    if (isTrue)
      return input || true;

    if (!assert)
      return false;

    throw new Error(`"${typeof assert !== 'string' ? 'input' : assert}" ${errorMessage}`);
  };
};

export const noop = () => {};
export const isRequired = internals.Checker(input => !!input, 'is required');
export const isInstanceOf = type => internals.Checker(input => input instanceof type, `is not an instance of ${type.name}`);
export const isArray = isInstanceOf(Array);
export const isObject = internals.Checker(input => typeof input === 'object', 'must be an object');
export const isString = internals.Checker(input => typeof input === 'string', 'must be a string');
export const isFunction = internals.Checker(input => typeof input === 'function', 'must be a function');
export const isNumber = internals.Checker(input => typeof input === 'number', 'must be a number');
export const isInteger = internals.Checker(input => Number.isInteger(input), 'must be an integer');


export const isElement = internals.Checker(object => {

  if (!object || typeof object !== "object")
    return false;

  if (typeof HTMLElement === "object" )
    return object instanceof HTMLElement;

  return object.nodeType === 1 && typeof object.nodeName === "string";
}, 'must be a HTMLElement');

export const round = (value, decimals) => {

  isRequired(value, 'value');
  isNumber(value, 'value');

  isRequired(decimals, 'decimals');
  isInteger(decimals, 'decimals');

  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};