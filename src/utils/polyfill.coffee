# http://paulirish.com/2011/requestanimationframe-for-smart-animating/
# http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
# requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
# MIT license

do ->
    lastTime = 0
    vendors = ['ms', 'moz', 'webkit', 'o']

    if not global.requestAnimationFrame
        for vendor in vendors
            global.requestAnimationFrame = global[vendor + 'RequestAnimationFrame']
            global.cancelAnimationFrame = global[vendor + 'CancelAnimationFrame'] or global[vendor + 'CancelRequestAnimationFrame']

    if not global.requestAnimationFrame
        global.requestAnimationFrame = (callback, element) ->
            currTime = new Date().getTime()
            timeToCall = Math.max(0, 16 - (currTime - lastTime))
            id = global.setTimeout((-> callback currTime + timeToCall), timeToCall)
            lastTime = currTime + timeToCall
            return id

    if not global.cancelAnimationFrame
        global.cancelAnimationFrame = (id) ->
            clearTimeout id

    return undefined


# perf.now polyfill by Paul Irish
# relies on Date.now() which has been supported everywhere modern for years.
# as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values
 
# if you want values similar to what you'd get with real perf.now, place this towards the head of the page
# but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed

do ->
    if not global.performance?
        global.performance = {}

    if not global.performance.now?
        nowOffset = Date.now()

        if global.performance.timing?.navigationStart?
            nowOffset = performance.timing.navigationStart

        global.performance.now = ->
            Date.now() - nowOffset

    return undefined