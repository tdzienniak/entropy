type = require '../utils/type'
debug = require '../debug/debug'
#config = require '../config/config'

class Engine
	@Component: (obj) ->
		if type.of obj isnt 'object'
			debug.error 'Component pattern must be an object'
			return 

		if not 'name' of obj or not 'initialize' of obj
			debug.error 'You must define both "name" and "initialize" of component pattern'
			return

	constructor: ->
		@componetsPool = []

module.exports = Engine