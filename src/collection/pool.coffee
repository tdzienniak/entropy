
class Pool
    constructor: ->
        @size = 0
        @pool = {}

    push: (key, value) ->
        if not (key of @pool)
            @pool[key] = []

        @size++

        return @pool[key].push value

    pop: (key) ->
        if @has key
            @size--

            return @pool[key].pop()
        else
            return undefined

    has: (key) ->
        return key of pool and @pool[key].length > 0

    size: ->
        return @size


module.exports = Pool