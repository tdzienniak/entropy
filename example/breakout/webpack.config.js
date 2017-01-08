var webpack = require('webpack');

module.exports = {
  entry: {
    game: './src/Breakout.js',
  },
  output: {
    path: './dist',
    filename: 'breakout.js',
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
}