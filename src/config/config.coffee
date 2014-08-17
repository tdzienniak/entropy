type = require '../utils/type'

DEFAULT_CONFIG =
    debug: 3
    max_components_count: 100
    max_frame_time: 20
    default_time_factor: 1
    default_fps: 60

USER_CONFIG = {}

module.exports = (key, value) ->
    if not type.of.string key
        return null

    if not value?
        if key of USER_CONFIG
            return USER_CONFIG[key]

        if key of DEFAULT_CONFIG
            return DEFAULT_CONFIG[key]

        return null
    else
        USER_CONFIG[key] = value