config = require '../config/config'
raf = global.requestAnimationFrame

EventEmitter = require './event'

class Ticker extends EventEmitter
    constructor: ->
        super()

        @FPS = config 'default_fps'
        @MAX_FRAME_TIME = config 'max_frame_time'
        @TIME_FACTOR = config 'default_time_factor'

        @_paused = false
        @_running = false
        @_ticks = 0
        @_lastTime = 0
        @_currentFPS = @FPS
        @_rafId = -1

    setFPS: (fps) ->
        @FPS = fps or @FPS

    getCurrentFPS: ->
        return Math.round @_currentFPS

    setTimeFactor: (factor) ->
        @TIME_FACTOR = factor or @TIME_FACTOR

    getTicks: ->
        return @_ticks

    ###*
     * Pauses ticker.
     * 
     * @return {Boolean} true if paused succesfuly
    ###
    pause: ->
        if not @_running
            return false

        @_paused = true

        return true

    ###*
     * Resumes ticker.
     * 
     * @return {Boolean} true if resumed succesfuly
    ###
    resume: ->
        if not @_running
            return false

        @_paused = false

        return true

    start: ->
        if @_paused
            do @resume

        if @_running
            return false

        @_rafId = raf @_tick.bind @
        @emit 'ticker:start'

        @_running = true

        return true

    stop: ->
        if @_rafId isnt -1
            global.cancelAnimationFrame @_rafId
            @_running = @_paused = false
            @emit 'ticker:stop'

            return true
        else
            return false

    toggle: ->
        if not @_running
            return false

        @_paused = not @_paused

        return true

    isPaused: ->
        return @_paused

    isRunning: ->
        return @_running and not @_paused

    _tick: (time) ->
        #time ?= 0
        time ?= performance.now()
        delta = time - @_lastTime
        @_lastTime = time

        @_rafId = raf @_tick.bind @

        if @_paused
            return

        if delta >= @MAX_FRAME_TIME
            delta = 1000 / @FPS

        if @_ticks % @FPS is 0
            @_currentFPS = 1000 / delta

        event =
            delta: delta * @TIME_FACTOR
            tick: @_ticks
            time: time
            paused: @_paused

        @emit 'ticker:tick', event

        @_ticks += 1

module.exports = Ticker