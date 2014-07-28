var Engine = require('./engine');

function Entropy () {
	this.engine = new Engine();
	console.log(this.engine, 'Entropy Constructor');
}

module.exports = Entropy;