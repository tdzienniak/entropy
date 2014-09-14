require './utils/polyfill'

debug = require './debug/debug'

Const = require './utils/const'
Engine = require './core/engine'
LinkedList = require './collection/doublylinkedlist'
OrderedLinkedList = require './collection/orderedlinkedlist'
Ticker = require './core/ticker'
Game = require './core/game'
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
    @Const: (key, value) ->
        Const.call(@, key, value)

    @Game: Game
    @Engine: Engine

    @Ticker: Ticker
    @LinkedList: LinkedList
    @OrderedLinkedList: OrderedLinkedList

    constructor: ->
        debug.warning 'this function should not be used as a constructor'
        return

module.exports = Entropy