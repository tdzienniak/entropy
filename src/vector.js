(function (app) {
    var Vector = function (coords) {
        if (Object.prototype.toString.call(coords) === "[object Array]") {
            this.x = coords[0];
            this.y = coords[1];
            this.updatePolarCoords();
        } else if (typeof coords === 'object') {
            if (typeof coords.x === 'undefined') { //podano wspórzędne biegunowe
                this.angle = coords.angle;
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
    }

    var v = Vector.prototype;

    v.rotate = function (angle) {
        var fullAngles = Math.abs(angle / 360),
            newAngle;

        if (fullAngles >= 1 && angle > 0) {
            fullAngles = Math.floor(fullAngles);
            newAngle = this.angle + (angle - (fullAngles * 360));
        } else if (fullAngles >= 1 && angle < 0) {
            newAngle = this.angle + (angle + (fullAngles * 360));
        } else {
            newAngle = this.angle + angle;
        }

        if (newAngle > 180) {
            this.angle = -360 + newAngle;
        } else if (newAngle < -180) {
            this.angle = 360 + newAngle;
        } else {
            this.angle = newAngle;
        }

        this.updateCartCoords();
        return this;
    };

    v.add = function (vector, returnNew) {
        var returnNew = returnNew || false;

        if (Object.prototype.toString.call(vector) === "[object Array]") {
            this.x += vector[0];
            this.y += vector[1];
            this.updatePolarCoords();
        } else if (typeof vector === 'object') {
            if (returnNew) { //zwraca nowy wektor, nie modyfikuje obecnego
                return new Vector([this.x + vector.x, this.y + vector.y]);
            } else {
                this.x += vector.x;
                this.y += vector.y;

                this.updatePolarCoords();
            }
            return this;
        } else {
            throw new Error('Zły parametr.')
        }
    };

    v.scale = function (scalar, returnNew) {
        var returnNew = returnNew || false;

        if (returnNew) { //zwraca nowy wektor, nie modyfikuje obecnego
            return new Vector([this.x * scalar, this.y * scalar]);
        } else {
            this.x *= scalar;
            this.y *= scalar;
            this.updatePolarCoords();
        }

        return this;
    };

    v.setAngle = function (angle, returnNew) {
        var returnNew = returnNew || false;

        if (returnNew) {
            return new Vector({length: this.length, angle: angle});
        } else {
            this.angle = angle;
            this.updateCartCoords();

            return this;
        }
    };

    v.truncate = function (desiredLength, returnNew) {
        var returnNew = returnNew || false;

        if (returnNew) { //zwraca nowy wektor, nie modyfikuje obecnego
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

    v.normalize = function (returnNew) {
        return this.truncate(1, returnNew);
    };

    v.substract = function (vector, returnNew) {
        var returnNew = returnNew || false;

        if (typeof vector === 'object') {
            if (returnNew) { //zwraca nowy wektor, nie modyfikuje obecnego
                return new Vector([this.x - vector.x, this.y - vector.y]);
            } else {
                this.x -= vector.x;
                this.y -= vector.y;

                this.updatePolarCoords();
            }

            return this;
        } else {
            throw new Error('Zły parametr.')
        }
    };

    v.dot = function (vector) {
        var scalar;

        if (Object.prototype.toString.call(vector) === "[object Array]") {
            scalar = this.x * vector[0] + this.y * vector[1];
        } else if (typeof vector === 'object') {
            scalar = this.x * vector.x + this.y * vector.y;
        } else {
            throw new Error('Zły parametr.')
        }

        return scalar;
    }

    v.reverseX = function (returnNew) {
        var returnNew = returnNew || false;

        if (returnNew) {
            return new Vector([-this.x, this.y]);
        } else {
            this.x = -this.x;
            this.updatePolarCoords();
        }
    }

    v.reverseY = function (returnNew) {
        var returnNew = returnNew || false;

        if (returnNew) {
            return new Vector([this.x, -this.y]);
        } else {
            this.y = -this.y;
            this.updatePolarCoords();
        }
    }

    v.reverseBoth = function (returnNew) {
        var returnNew = returnNew || false;

        if (returnNew) {
            return new Vector([-this.x, -this.y]);
        } else {
            this.x = -this.x;
            this.y = -this.y;
            this.updatePolarCoords();
        }

        return this;
    }

    v.angleBetween = function (vector) {

    }

    v.negate = function (returnNew) {

    }

    v.clone = function () {
        return new Vector([this.x, this.y]);
    };

    v.updatePolarCoords = function () {
        this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        this.angle = Math.atan2(this.y, this.x) * 180 / Math.PI;
    };

    v.updateCartCoords = function () {
        this.x = Math.cos(this.angle * Math.PI / 180) * this.length;
        this.y = (this.angle === 180 || this.angle === -180) ? 0 : Math.sin(this.angle * Math.PI / 180) * this.length
    };

    v.debug = function () {
        return "x: " + this.x + ", y: " + this.y + ", angle: " + this.angle + ", length: " + this.length;
    };

    app["Vector"] = Vector;
})(app);