
#Easing functions by Robert Panner
#http://www.robertpenner.com/easing/

#t: current time, b: beginning value, c: change in value, d: duration

module.exports =
    Linear:
        In: (t, b, c, d) ->
            return c * t / d + b
    Quadratic:
        In: (t, b, c, d) ->
            t /= d
            return c * t * t + b
        Out: (t, b, c, d) ->
            t /= d
            return -c * t*(t-2) + b
        InOut: (t, b, c, d) ->
            t /= d / 2
            if t < 1
                return c / 2 * t * t + b
            t--
            return -c / 2 * (t * (t - 2) - 1) + b
    Cubic:
        In: (t, b, c, d) ->
            t /= d
            return c*t*t*t + b
        Out: (t, b, c, d) ->
            t /= d
            t--
            return c*(t*t*t + 1) + b
        InOut: (t, b, c, d) ->
            t /= d/2
            if t < 1
                return c/2*t*t*t + b
            t -= 2
            return c/2*(t*t*t + 2) + b
    Quartic:
        In: (t, b, c, d) ->
            t /= d
            return c*t*t*t*t + b
        Out: (t, b, c, d) ->
            t /= d
            t--
            return -c * (t*t*t*t - 1) + b
        InOut: (t, b, c, d) ->
            t /= d/2
            if t < 1
                return c/2*t*t*t*t + b
            t -= 2
            return -c/2 * (t*t*t*t - 2) + b
    Quintic:
        In: (t, b, c, d) ->
            t /= d
            return c*t*t*t*t*t + b
        Out: (t, b, c, d) ->
            t /= d
            t--
            return c*(t*t*t*t*t + 1) + b
        InOut: (t, b, c, d) ->
            t /= d/2
            if t < 1
                return c/2*t*t*t*t*t + b
            t -= 2
            return c/2*(t*t*t*t*t + 2) + b
    Sine:
        In: (t, b, c, d) ->
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b
        Out: (t, b, c, d) ->
            return c * Math.sin(t/d * (Math.PI/2)) + b
        InOut: (t, b, c, d) ->
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b
    Exponential:
        In: (t, b, c, d) ->
            return c * Math.pow( 2, 10 * (t/d - 1) ) + b
        Out: (t, b, c, d) ->
            return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b
        InOut: (t, b, c, d) ->
            t /= d/2
            if t < 1
                return c/2 * Math.pow( 2, 10 * (t - 1) ) + b
            t--
            return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b
    Circular:
        In: (t, b, c, d) ->
            t /= d
            return -c * (Math.sqrt(1 - t*t) - 1) + b
        Out: (t, b, c, d) ->
            t /= d
            t--
            return c * Math.sqrt(1 - t*t) + b
        InOut: (t, b, c, d) ->
            t /= d/2
            if t < 1
                return -c/2 * (Math.sqrt(1 - t*t) - 1) + b
            t -= 2
            return c/2 * (Math.sqrt(1 - t*t) + 1) + b
