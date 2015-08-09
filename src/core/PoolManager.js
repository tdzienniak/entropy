'use strict';

var config = require('./config')
var extend = require('node.extend');
var Pool = require('./Pool');

function PoolManager () {
    this._entityPool = new Pool();
    this._componentPool = new Pool();
}

extend(PoolManager.prototype, {
    putEntity: function (entity) {

    },
    getEntity: function (entityName) {

    },
    putComponent: function () {


    },
    getComponent: function () {


    }
})