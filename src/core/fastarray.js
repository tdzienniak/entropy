module.exports = {
    alloc: function (size) {
        var arr = new Array(size);

        for (var i = 0; i < size; i++) {
            arr[i] = 0;
        }

        return arr;
    },
    extend: function (arr, extensionSize) {
        var oldLength = arr.length;

        arr.length = oldLength + extensionSize;

        for (var i = oldLength, newLength = arr.length; i < newLength; i++) {
            arr[i] = 0;
        }

        return arr;     
    },
    removeAtIndex: function (arr, index) {
        var len = arr.length;
        
        if (!len) { 
            return;
        }
        
        while (index < len) { 
            arr[index] = arr[index + 1];
            index++;
        }
        
        arr.length--;
    },
    push: function (arr, arrayLength, value) {
        if (arrayLength === arr.length) {
            this.extend(arr, Math.round(arr.length * 1.5));
        }

        arr[arrayLength] = value;
    }
};
