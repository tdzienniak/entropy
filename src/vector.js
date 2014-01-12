(function (app) {

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function radToDeg(radians) {
        return radians * 180 / Math.PI;
    }

    var Vector = function (coords) {
        if (Object.prototype.toString.call(coords) === "[object Array]") {
            this.x = coords[0];
            this.y = coords[1];
            this.updatePolarCoords();
        } else if (typeof coords === 'object') {
            if (typeof coords.x === 'undefined') { //podano wspórzędne biegunowe
                this.angle = 0;
                this.rotate(coords.angle);

                this.length = coords.length;

                //uzupełnianie wspórzędnych kartezjańskich
                this.updateCartCoords();
            } else { //podano wspórzędne kartezjańskie
                this.x = coords.x;
                this.y = coords.y;

                //uzupełnianie współrzędnych biegunowych
                this.updatePolarCoords();
            }
        } else {
            throw new Error('Podałeś zły format współrzędnych!');
        }
    };

    var v = Vector.prototype;

    v.rotate = function (angle, return_new) {
        angle %= 360;
        return_new = return_new || false;

        if (return_new) {
            return new Vector({length: this.length, angle: this.angle + angle});
        } else {
            this.angle += angle;
            this.angle %= 360;

            this.updateCartCoords();

            return this;
        }
    };

    v.rotateRad = function (angle, return_new) {
        angle = angle % (2 * Math.PI);
        return_new = return_new || false;

        if (return_new) {
            return new Vector({length: this.length, angle: this.angle + radToDeg(angle)});
        } else {
            this.rotate(radToDeg(angle));

            return this;
        }
    };

    v.add = function (vector, return_new) {
        return_new = return_new || false;
        var x, y;

        if (Object.prototype.toString.call(vector) === "[object Array]") {
            x = vector[0];
            y = vector[1];
        } else if (typeof vector === 'object') {
            x = vector.x;
            y = vector.y;
        } else {
            throw new Error('Zły parametr.');
        }

        if (return_new) { //zwraca nowy wektor, nie modyfikuje obecnego
            return new Vector([this.x + x, this.y + y]);
        } else {
            this.x += x;
            this.y += y;

            this.updatePolarCoords();

            return this;
        }
    };

    v.scale = function (scalar, return_new) {
        return_new = return_new || false;

        if (return_new) { //zwraca nowy wektor, nie modyfikuje obecnego
            return new Vector([this.x * scalar, this.y * scalar]);
        } else {
            this.x *= scalar;
            this.y *= scalar;

            this.updatePolarCoords();
        }

        return this;
    };

    v.setAngle = function (angle, return_new) {
        return_new = return_new || false;

        if (return_new) {
            return new Vector({length: this.length, angle: angle});
        } else {
            this.angle = 0;
            this.rotate(angle);

            return this;
        }
    };

    v.getRadAngle = function () {
        return degToRad(this.angle);
    };

    v.truncate = function (desiredLength, return_new) {
        return_new = return_new || false;

        if (return_new) { //zwraca nowy wektor, nie modyfikuje obecnego
            return new Vector({
                angle: this.angle,
                length: desiredLength
            });
        } else {
            this.length = desiredLength;
            this.updateCartCoords();
        }

        return this;
    };

    v.normalize = function (return_new) {
        return this.truncate(1, return_new);
    };

    v.substract = function (vector, return_new) {
        return_new = return_new || false;
        var x, y;

        if (Object.prototype.toString.call(vector) === "[object Array]") {
            x = vector[0];
            y = vector[1];
        } else if (typeof vector === 'object') {
            x = vector.x;
            y = vector.y;
        } else {
            throw new Error('Zły parametr.');
        }

        if (return_new) { //zwraca nowy wektor, nie modyfikuje obecnego
            return new Vector([this.x - x, this.y - y]);
        } else {
            this.x -= x;
            this.y -= y;

            this.updatePolarCoords();

            return this;
        }
    };

    v.dot = function (vector) {
        var scalar;

        if (Object.prototype.toString.call(vector) === "[object Array]") {
            scalar = this.x * vector[0] + this.y * vector[1];
        } else if (typeof vector === 'object') {
            scalar = this.x * vector.x + this.y * vector.y;
        } else {
            throw new Error('Zły parametr.');
        }

        return scalar;
    };

    v.reverseX = function (return_new) {
        return_new = return_new || false;

        if (return_new) {
            return new Vector([-this.x, this.y]);
        } else {
            this.x = -this.x;
            this.updatePolarCoords();
        }
    };

    v.reverseY = function (return_new) {
        return_new = return_new || false;

        if (return_new) {
            return new Vector([this.x, -this.y]);
        } else {
            this.y = -this.y;
            this.updatePolarCoords();
        }
    };

    v.reverseBoth = function (return_new) {
        return_new = return_new || false;

        if (return_new) {
            return new Vector([-this.x, -this.y]);
        } else {
            this.x = -this.x;
            this.y = -this.y;
            this.updatePolarCoords();
        }

        return this;
    };

    v.minAngleTo = function (vector) {
        if (this.angle < 0) {
            this.angle += 360;
        }

        if (vector.angle < 0) {
            vector.angle += 360;
        }

        var angle = vector.angle - this.angle;

        if (angle > 180) {
            angle = 360 + this.angle - vector.angle;
        } else if (angle < -180) {
            angle = 360 - this.angle + vector.angle;
        }

        return angle;
    };

    v.negate = function (return_new) {
        return this.reverseBoth(return_new);
    };

    v.clone = function () {
        return new Vector([this.x, this.y]);
    };

    v.updatePolarCoords = function () {
        this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));

        this.angle = 0;
        this.rotate(radToDeg(Math.atan2(this.y, this.x) + 2 * Math.PI));
    };

    v.updateCartCoords = function () {
        this.x = Math.cos(degToRad(this.angle)) * this.length;
        this.y = Math.sin(degToRad(this.angle)) * this.length;
        //this.y = (this.angle === 180 || this.angle === -180) ? 0 : Math.sin(this.angle * Math.PI / 180) * this.length
    };

    v.debug = function () {
        return "x: " + this.x + ", y: " + this.y + ", angle: " + this.angle + ", length: " + this.length;
    };

    app["Vector"] = Vector;
})(app);