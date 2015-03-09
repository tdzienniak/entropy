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

        if (len === 0) {
            return;
        }

        while (index < len) {
            arr[index] = arr[++index];
        }

        arr.length--;
    },
    removeAtIndexConst: function (arr, arrayLength, index) {
        if (arrayLength === 0) {
            return;
        }

        while (index < arrayLength - 1) {
            arr[index] = arr[++index];
        }

        arr[arrayLength - 1] = 0;
    },
    indexOf: function (arr, arrayLength, value) {
        for (var i = 0; i < arrayLength; i++) {
            if (arr[i] === value) {
                return i;
            }
        }

        return -1;
    },
    clear: function (arr, arrayLength) {
        for (var i = 0; i < arrayLength; i++) {
            arr[i] = 0;
        }
    },
    push: function (arr, arrayLength, value) {
        if (arrayLength === arr.length) {
            this.extend(arr, Math.round(arr.length * 1.5));
        }

        arr[arrayLength] = value;
    }
};
