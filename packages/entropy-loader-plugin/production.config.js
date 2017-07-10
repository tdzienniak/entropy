var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    'entropy-loader': './src/index.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name]-plugin.min.js',
    library: 'EntropyLoaderPlugin',
  },
  externals: {
    'entropy.js': 'Entropy',
    stampit: 'Entropy.stampit',
    'pixi.js': 'PIXI',
    howler: 'Howl',
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
  plugins: [new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  })],
};
