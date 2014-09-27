config = require '../config/config'

module.exports = 
    log: (message...) ->
        if config('debug') >= 3
            console.log message...
    warning: (message...) ->
        if config('debug') >= 2
            console.warn message...
    error: (message...) ->
        if config('debug') >= 1
            console.error message...