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
 * witch are arrays of component names to respectively include and/or exclude. Object can also have `name` property,
 * that will match entities with given name. 
 *
 * @example
 *     //matches entities with 'Position' and 'Velocity' components
 *     var q1 = new Entropy.Query(["Position", "Velocity"]);
 *
 *     //matches entities with 'Position' and 'Velocity' components and without 'Sprite' component
 *     var q2 = new Entropy.Query({
 *         include: ["Position", "Velocity"],
 *         exclude: ["Sprite"]
 *     });
 *
 *     //matches entities with name 'Ball'
 *     var q3 = new Entropy.Query({
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

    if (include.length === 0 && exclude.length === 0 && name == null) {
        debug.warn('You want to create empty query. If your intention is to get all entities, use getAllEntities() instead.');
        return;
    }

    if (include.length > 0) {
        includeBS = new BitSet(config('max_component_count'));
        for (var i = 0; i < include.length; i++) {
            includeBS.set(register.getComponentID(include[i]));
        }
    }

    if (exclude) {
        excludeBS = new BitSet(config('max_component_count'));
        for (var e = 0; e < exclude.length; e++) {
            excludeBS.set(register.getComponentID(exclude[i]))
        }
    }

    this.matchName = name;
    this.includes = includeBS;
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
            satisfies = satisfies && includes.clone().and(entity.bitset).equals(includes);
        }

        if (excludes != null) {
            satisfies = satisfies && excludes.and(entity.bitset).isEmpty();
        }

        return satisfies;
    }
});

module.exports = Query;