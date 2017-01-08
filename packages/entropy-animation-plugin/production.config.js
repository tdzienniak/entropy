var webpack = require('webpack');

module.exports = {
  entry: {
    'entropy-animation': './src/index.js',
  },
  output: {
    path: './dist',
    filename: '[name]-plugin.min.js',
    library: 'EntropyAnimationPlugin',
  },
  externals: {
    'entropy.js': 'Entropy',
    stampit: 'Entropy.stampit',
    'pixi.js': 'PIXI',
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
  plugins: [new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  })],
};
