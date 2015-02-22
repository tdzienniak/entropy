var is = require('check-types');

var DEFAULT_CONFIG = {
    debug: 3,
    max_components_count: 100,
    max_frame_time: 20,
    time_factor: 1,
    default_fps: 60,
    ids_to_reuse_pool_size: 1000,
    initial_components_pool_size: 1000,
    initial_entities_pool_size: 1000
};

var USER_CONFIG = {};

module.exports = function (key, value) {
    if (is.not.unemptyString(key)) {
        return;
    }

    if (value == null) {
        if (key in USER_CONFIG) {
            return USER_CONFIG[key];
        }

        if (key in DEFAULT_CONFIG) {
            return DEFAULT_CONFIG[key];
        }
    } else {
        USER_CONFIG[key] = value;
    }
}