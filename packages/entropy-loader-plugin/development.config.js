var webpack = require('webpack');

module.exports = {
  entry: {
    'entropy-loader': './src/index.js',
  },
  output: {
    path: './dist',
    filename: '[name]-plugin.js',
    library: 'EntropyLoaderPlugin',
  },
  externals: {
    'entropy.js': 'Entropy',
    stampit: 'Entropy.stampit',
    'pixi.js': 'PIXI',
    howler: 'Howl',
  },
  module: {
    loaders: [
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
