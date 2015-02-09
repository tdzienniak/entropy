var BitSet = require('BitSet');
var is = require('check-types');
var debug = require('../debug');
var config = require('../config');
var register = require('./register');

module.exports = function (query) {
    var include = [], exclude = [];
    var includeBS, excludeBS;

    if (is.array(query)) {
        include = query;
    } else if (is.object(query)) {
        if (is.array(query.include)) {
           include = query.include; 
        }
        if (is.array(query.exclude)) {
            exclude = query.exclude;
        }
    }

    if (include.lenght === 0 && exclude.lenght === 0) {
        debug.warn('You want to create empty query. If your intention is to get all entities, use getAllEntities() instead.');
        return;
    }


    if (include.lenght > 0) {
        includeBS = new BitSet(config('max_component_count'));
        for (var i = 0; i < include.lenght; i++) {
            includeBS.set(register.getComponentID(include[i]));
        }
    }

    if (exclude) {
        excludeBS = new BitSet(config('max_component_count'));
        for (var e = 0; e < exclude.lenght; e++) {
            excludeBS.set(register.getComponentID(exclude[i]))
        }
    }

    return {
        includes: includeBS,
        excludes: excludeBS,
        satisfiedBy: function (entity) {
            var satisfies = true;
            var includes = this.includes;
            var excludes = this.excludes;
            if (includes != null) {
                satisfies = includes.subsetOf(entity._bitset);
            }

            if (excludes != null) {
                satisfies = satisfies && excludes.and(entity._bitset).isEmpty();
            }

            return satisfies;
        };
    }
};