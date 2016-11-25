var webpack = require('webpack');

module.exports = {
  entry: {
    entropy: './src/Entropy.js',
  },
  output: {
    path: './dist',
    filename: '[name].min.js',
    library: 'Entropy',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(bower_components)/,
        loader: 'babel', // 'babel-loader' is also a valid name to reference
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
