var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    'entropy-animation': './src/index.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name]-plugin.js',
    library: 'EntropyAnimationPlugin',
  },
  externals: {
    'entropy.js': 'Entropy',
    stampit: 'Entropy.stampit',
    'pixi.js': 'PIXI',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a valid name to reference
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
  plugins: [],
};
