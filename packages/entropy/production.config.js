var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    entropy: './src/Entropy.js',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].min.js',
    library: 'Entropy',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a valid name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })]
}
