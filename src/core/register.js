'use strict';

var is = require('check-types');
var debug = require('./debug');
var config = require('./config');

var canModify = true;
var componentPatterns = {};
var systemPatterns = {};
var entityPatterns = {};
var nextComponentId = 0;

module.exports = {
    registerComponent: function (component) {
        if (!canModify) {
            debug.error('you can\'t define new component during system work')
            return false;
        }

        if (is.not.object(component)) {
            debug.error('component pattern must be an object');
            return false;
        }

        if (!('name' in component) || !('initialize' in component)) {
            debug.error('you must define both "name" and "initialize" of component pattern');
            return false;
        }

        if (component.name in componentPatterns) {
            debug.error('you can\'t define same component twice');
            return false;
        }

        component._bit = nextComponentId++;
        componentPatterns[component.name.toLowerCase()] = component;

        return true;
    },
    registerSystem: function (system) {
        if (!canModify) {
            debug.error('you can\'t define new system during system work');
            return false;
        }

        if (!is.object(system)) {
            debug.error('system pattern must be an object');
            return false;
        }

        if (!('name' in system) || !('update' in system)) {
            debug.error('you must define both "name" and "update" of system pattern');
            return false;
        }

        if (system.name in systemPatterns) {
            debug.error('you can\'t define same system twice');
            return false;
        }

        systemPatterns[system.name] = system;

        return true;
    },
    registerEntity: function (entity) {
        if (!canModify) {
            debug.error('you can\'t define new system during system work');
            return false;
        }

        if (is.not.object(entity)) {
            debug.error('entity pattern must be an object');
            return false;
        }

        if (!('name' in entity) || !('create' in entity)) {
            debug.error('you must define both "name" and "create" of entity pattern');
            return false;
        }

        if (entity.name in entityPatterns) {
            debug.error('you can\'t define same entity twice');
            return false;
        }

        entityPatterns[entity.name] = entity;

        return true;
    },
    listComponentsNames: function () {
        return Object.keys(componentPatterns);
    },
    listEntitiesNames: function () {
        return Object.keys(entityPatterns);
    },
    getComponentPattern: function (name) {
        return componentPatterns[name.toLowerCase()];
    },
    getComponentID: function (name) {
        return componentPatterns[name.toLowerCase()]._bit;
    },
    getSystemPattern: function (name) {
        return systemPatterns[name];
    },
    getEntityPattern: function (name) {
        return entityPatterns[name];
    },
    canModify: function () {
        return canModify;
    },
    setCannotModify: function () {
        canModify = false;
    }
}