var expect = require('chai').expect;

var array = require('../src/core/fastarray');

describe('fastarray', function(){
    describe('alloc', function(){
        it('should allocate 1000 element array and fill it with zeros', function(){
            var arr = array.alloc(1000);

            expect(arr).to.have.length(1000);

            for (var i = 0; i < 1000; i++) {
                expect(arr[i]).to.be.equal(0);
            }
        })

        it('should throw when called with argument other than number', function () {
            expect(function () {
                array.alloc()
            }).to.throw(Error);

            expect(function () {
                array.alloc('this is not a number')
            }).to.throw(Error);
        })
    })

    describe('extend', function(){

    })

    describe('removeAtIndex', function(){

    })

    describe('removeAtIndexConst', function(){

    })

    describe('indexOf', function(){

    })

    describe('clear', function(){
        it('should fill array with zeros', function () {
            var length = 1000;
            var arr = array.alloc(1000);

            arr[0] = 1;
            arr[999] = 1;
            arr[500] = 1;

            array.clear(arr, length);

            for (var i = 0; i < arr.length; i++) {
                expect(arr[i]).to.be.equal(0);
            }        
        })
    })

    describe('push', function(){

    })
})