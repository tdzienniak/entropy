!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Entropy=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
          var DoublyLinkedList, Node;

          Node = (function() {
              function Node(data) {
                  this.prev = null;
                  this.next = null;
                  this.data = data != null ? data : null;
              }

              return Node;

          })();
      this.tail = this.head = node;
                return this;
            }
                this.head.prev = node;
                node.next = this.head;
        var Engine, debug, type;

        type = _dereq_('../utils/type');

debug = _dereq_('../debug/debug');

Engine = (function() {
Engine.Component = function(obj) {,
    if (type.of(obj !== 'object')) {,
    debug.error('Component pattern must be an object');,
    return;,
    this.head = node;
    return this;
};

    DoublyLinkedList.prototype.join = function(list, prepend) {
    var _ref, _ref1;
    if (prepend == null) {
    module.exports = DoublyLinkedList;




    prepend = false;
}
    if (!list instanceof DoublyLinkedList) {
    console.warn('DoublyLinkedList.join argument must be type of DoublyLinkedList');
    return this;
}
    if (list.head == null) {
    return this;
}
    if (this.head == null) {
    this.head = list.head;
    this.tail = list.tail;
    return this;
}
        * [constructor description]
        *
        * @return {[type]} [description]
        */

module.exports = Entropy;
},{"./collection/doublylinkedlist":1,"./core/engine":2,"./utils/const":5}],5:[function(_dereq_,module,exports){
        Entropy.Const = _dereq_('./utils/const');

        Entropy.Eng


        Entropy.LinkedList = LinkedList;
        function Entropy() {
            return 5;
        }


        return Entropy;
    })();
    var debug, type;
    ine = Engine;

    type = _dereq_('./type');
    if (prepend) {
    if ((_ref = list.tail) != null) {
        _ref.next = this.head;
    }
    this.head.prev = list.tail;
                    this.head = list.head;
                    list.tail = this.tail;
                } else {
                    if ((_ref1 = list.head) != null) {
                                    _ref1.prev = this.tail;
                                }
                    this.tail.next = list.head;
                    this.tail = list.tail;
                    list.head = this.head;
                }
            return this;
        };

    return DoublyLinkedList;

})();
module.exports = Engine;




module.exports = {
error: function(message) {
    return console.log(message);
}
};
},{}],2:[function(_dereq_,module,exports){
}
if (!'name' in obj || !'initialize' in obj) {
debug.error('You must define both "name" and "initialize" of component pattern');
}



};

function Engine() {
this.componetsPool = [];
}

return Engine;

})();
},{"../debug/debug":3,"../utils/type":6}],3:[function(_dereq_,module,exports){
},{}],4:[function(_dereq_,module,exports){
var Engine, Entropy, LinkedList;

Engine = _dereq_('./core/engine');

LinkedList = _dereq_('./collection/doublylinkedlist');



console.log.apply(console, ["%c %c %c Entropy 0.1 - Entity System Framework for JavaScript %c %c ", "background: rgb(200, 200,200);", "background: rgb(80, 80, 80);", "color: white; background: black;", "background: rgb(80, 80, 80);", "background: rgb(200, 200, 200);"]);


Entropy = (function() {
,
*/
/**
    * Welcome message.
    /**
    *
    */

DoublyLinkedList.prototype.prepend = function(data) {
/**

        debug = _dereq_('../debug/debug');

    },{"../debug/debug":3,"./type":6}],6:[function(_dereq_,module,exports){
        module.exports = function(name, value) {
            if ((name == null) || type(name) !== 'string') {
                module.exports = function(obj) {
                    var classToType;,
                    if (obj === void 0 || obj === null) {,
                        return String(obj);
                        debug.error('constans name should be non-empty string');
                        return;
                    }



                },{}]},{},[4])
            name = name.toUpperCase();
            if (name in this) {
            }

            var node;
            if (data == null) {
                return;
            }
            node = new Node(data);
            if (this.head == null) {
                '[object Object]': 'object'
            };
            return classToType[Object.prototype.toString.call(obj)];
        };
        return debug.error('cannot define same constans twice: %s', name);
    } else {
        Object.defineProperty(this, name, {



            value: value
        });
        return value;
    }
};,,,



DoublyLinkedList = (function() {

        function DoublyLinkedList() {
            this.head = this.tail = null;
        }

        DoublyLinkedList.prototype.append = function(data) {
            var node;
            if (data == null) {
                return;
            }
            node = new Node(data);
            if (this.head == null) {
                this.tail = this.head = node;
                return this;
            }
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
            return this;
        };
    });,,,,,,,,
classToType = {
'[object Boolean]': 'boolean'
'[object Number]': 'number'
'[object String]': 'string'
'[object Function]': 'function'
'[object Array]': 'array'
'[object Date]': 'date'
'[object RegExp]': 'regexp'
        (4)
