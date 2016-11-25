const toString = Object.prototype.toString;

export const toLowerFirstCase = str => str[0].toLowerCase() + str.slice(1);
export const isFunction = thing => toString.call(thing) === '[object Function]';
export const isString = thing => toString.call(thing) === '[object String]';
export const isArray = thing => Array.isArray(thing);
export const isObject = thing => toString.call(thing) === '[object Object]';
export const isNonEmptyString = thing => isString(thing) && thing !== '';
