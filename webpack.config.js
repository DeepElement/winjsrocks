var path = require("path"),
  webpack = require("webpack");

module.exports = {
  cache: true,
  entry: "./src/entry.js",
  output: {
    filename: "dist/webpack-bundle.js",
    library: "winjsrocks",
    libraryTarget: "umd"
  },
  node: {
    fs: "empty",
    crypto: "empty"
  },
  externals: {
    "winjs": "winjs"
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel?optional[]=runtime'
    }, {
      test: /\.(json|resjson)$/,
      loader: "json-loader"
    } ]
  }
};
