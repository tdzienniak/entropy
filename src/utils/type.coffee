toString = Object.prototype.toString.call

# module.exports = (obj) ->
#     if obj == undefined or obj == null
#         return String obj

#     classToType =
#         '[object Boolean]': 'boolean',
#         '[object Number]': 'number',
#         '[object String]': 'string',
#         '[object Function]': 'function',
#         '[object Array]': 'array',
#         '[object Date]': 'date',
#         '[object RegExp]': 'regexp',
#         '[object Object]': 'object'
    

#     return classToType[Object.prototype.toString.call(obj)]

module.exports =
    of: 
        undefined: (thing) ->
            return toString(thing) is '[object Undefined]'
        null: (thing) ->
            return toString(thing) is '[object Null]'
        string: (thing) ->
            return toString(thing) is '[object String]'
        number: (thing) ->
            return toString(thing) is '[object Number]'
        boolean: (thing) ->
            return toString(thing) is '[object Boolean]'
        function: (thing) ->
            return toString(thing) is '[object Function]'
        array: (thing) ->
            return toString(thing) is '[object Array]'
        date: (thing) ->
            return toString(thing) is '[object Date]'
        regexp: (thing) ->
            return toString(thing) is '[object RegExp]'
        object: (thing) ->
            return toString(thing) is '[object Object]'