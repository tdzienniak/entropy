type = require '../utils/type'

Engine = require './engine'
Input = require './input'
Ticker = require './ticker'
State = require './state'

EventEmitter = require './event'

FN = 0
BINDING = 1
ARGS = 2

class Game extends EventEmitter
    @State: State.register

    constructor: (initialState) ->
        super()

        @input = new Input(@)
        @engine = new Engine(@)
        @ticker = new Ticker(@)
        @state = State.State(@)

        @ticker.on "ticker:tick", @engine.update, @engine
        @engine.on "engine:updateFinished", @input.clearKeyTimes, @input

        if type.of.string initialState
            @state.change(initialState)

        return @

    start: ->
        @emit 'game:start',  @ticker.start()

    pause: ->
        @emit 'game:pause', @ticker.pause()

    resume: ->
        @emit 'game:resume', @ticker.resume()

    stop: (clear) ->
        if clear
            @engine.once 'engine:clear', => @emit 'game:stop', @ticker.stop()
            @engine.clear()
        else
            @emit 'game:stop', @ticker.stop()

    setRenderer: (@renderer) ->
    setStage: (@stage) ->
    changeState: (args...) ->
        @state.change args...
        
module.exports = Game
