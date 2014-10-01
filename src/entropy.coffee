require './utils/polyfill'

debug = require './debug/debug'
config = require './config/config'

Const = require './utils/const'
Engine = require './core/engine'
LinkedList = require './collection/doublylinkedlist'
OrderedLinkedList = require './collection/orderedlinkedlist'
###*
 * Welcome message.
###
console.log [
    "%c %c %c Entropy 0.2.0 - Entity System Framework for JavaScript %c %c ",
    "background: rgb(200, 200,200);",  
    "background: rgb(80, 80, 80);",
    "color: white; background: black;",
    "background: rgb(80, 80, 80);",
    "background: rgb(200, 200, 200);"
]...

###*
 * 
###
class Entropy
    @Easing: require './utils/easing'
    @Const: (key, value) ->
        Const.call(@, key, value)
    @Config: config
    @Game: require './core/game'
    @Engine: Engine
    @Ticker: require './core/ticker'

    constructor: ->
        debug.warning 'this function should not be used as a constructor'
        return

module.exports = Entropy