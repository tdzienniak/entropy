Engine = require './core/engine'
LinkedList = require './collection/doublylinkedlist'
###*
 * Welcome message.
###
console.log [
    "%c %c %c Entropy 0.1 - Entity System Framework for JavaScript %c %c ",
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
    @Const: require './utils/const'
    @Engine: Engine
    @LinkedList: LinkedList

    ###*
     * [constructor description]
     * 
     * @return {[type]} [description]
    ###
    constructor: ->
        return 5

module.exports = Entropy