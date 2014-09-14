type = require '../utils/type'
debug = require '../debug/debug'

states = {}

exports.State = (game) ->
    queue = []
    currentState =
        transitions: {}

    shifting = false

    shift = ->
        queueHead = queue.shift()

        if not queueHead?
            shifting = false
            return
        else
            shifting = true

        fn = queueHead.fn
        binding = queueHead.binding or null
        args = queueHead.args or []

        args.push next

        fn.apply binding, args

    next = ->
        do shift

    setCurrentState = (state, done) ->
        currentState = state
        do done

    setInitialized = (state, done) ->
        state._initialized = true
        do done

    initializeState = (state, done) ->
        if type.of.function state.initialize
            state.initialize.apply(state, [game, done])
        else
            do done

    enterState = (state, done) ->
        if type.of.function state.onEnter
            state.onEnter.apply(state, [game, done])
        else
            do done

    exitState = (done) ->
        if type.of.function currentState.onExit
            currentState.onExit.apply(currentState, [game, done])
        else
            do done

    doTransition = (to, nextState, args...) ->
        if to of currentState.transitions
            transitionFnName = currentState.transitions[to]

            currentState[transitionFnName].apply(currentState, [game, nextState].concat args)
        else
            done = args.pop()
            do done


    return {
        change: (name, args...) ->
            if not type.of.string(name) or not (name of states)
                debug.error 'state "' + name + '" does not exist - change will not occur'
                return

            nextState = states[name]

            queue.push
                fn: exitState

            if not nextState._initialized
                queue.push
                    fn: initializeState
                    args: [nextState]

                queue.push
                    fn: setInitialized
                    args: [nextState]

            queue.push
                fn: doTransition
                args: [name, nextState].concat args

            queue.push
                fn: enterState
                args: [nextState]

            queue.push
                fn: setCurrentState
                args: [nextState]

            do shift if not shifting

        current: ->
            return currentState.name

        isIn: (state) ->
            return state is currentState.name
    }


exports.register = (state) ->
    if not type.of.object state
        debug.error 'registered state must be an object'
        return @

    if not ('transitions' of state)
        state.transitions = {}

    state._initialized = false
    states[state.name] = state

    return @