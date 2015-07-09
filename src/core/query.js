'use strict';

var is = require('check-types');
var debug = require('./debug');
var config = require('./config');
var register = require('./register');
var extend = require('node.extend');

var BitSet = require('bitset.js').BitSet;

/**
 * Used to perform matching of entities.
 * Only parameter is an array of component names to include or object with `include` and/or `exclude` properties,
 * witch are arrays of component names to respectively include and/or exclude.
 *
 * @example
 *     var q1 = new Entropy.Engine.Query(["Position", "Velocity"]);
 *     var q2 = new Entropy.Engine.Query({
 *         include: ["Position", "Velocity"],
 *         exclude: ["Sprite"]
 *     });
 *     var q3 = new Entropy.Engine.Query({
 *         name: "Ball"
 *     });
 *
 * @class Query
 * @constructor
 * @param {Object|Array} query query conditions
 */
function Query (query) {
    var include = [], exclude = [], name;
    var includeBS, excludeBS;

    if (is.array(query)) {
        include = query;
    } else if (is.object(query)) {
        if (is.unemptyString(query.name)) {
            name = query.name;
        }

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

    this.matchName = name;
    this.include = includeBS;
    this.excludes = excludeBS;
}

extend(Query.prototype, {
    satisfiedBy: function (entity) {
        var satisfies = true;
        var includes = this.includes;
        var excludes = this.excludes;
        var name = this.matchName;

        if (name != null) {
            satisfies = entity.pattern.name === name;
        }

        if (includes != null) {
            satisfies = satisfies && includes.subsetOf(entity.bitset);
        }

        if (excludes != null) {
            satisfies = satisfies && excludes.and(entity.bitset).isEmpty();
        }

        return satisfies;
    }
});

module.exports = Query;