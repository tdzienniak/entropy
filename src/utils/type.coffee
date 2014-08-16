toString = Object.prototype.toString

module.exports =
    of: 
        undefined: (thing) ->
            return toString.call(thing) is '[object Undefined]'
        null: (thing) ->
            return toString.call(thing) is '[object Null]'
        string: (thing) ->
            return toString.call(thing) is '[object String]'
        number: (thing) ->
            return toString.call(thing) is '[object Number]'
        boolean: (thing) ->
            return toString.call(thing) is '[object Boolean]'
        function: (thing) ->
            return toString.call(thing) is '[object Function]'
        array: (thing) ->
            return toString.call(thing) is '[object Array]'
        date: (thing) ->
            return toString.call(thing) is '[object Date]'
        regexp: (thing) ->
            return toString.call(thing) is '[object RegExp]'
        object: (thing) ->
            return toString.call(thing) is '[object Object]'