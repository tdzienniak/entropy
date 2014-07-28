module.exports = (obj) ->
    if obj == undefined or obj == null
        return String obj

    classToType =
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Object]': 'object'
    

    return classToType[Object.prototype.toString.call(obj)]
