var path = require("path"),
  webpack = require("webpack");

module.exports = {
  cache: true,
  entry: "./dist/require-surface.js",
  output: {
    filename: "dist/webpack-bundle.js",
    library: "winjsrocks"
  },
  node: {
    fs: "empty"
  },
  externals: {
    "winjs": "WinJS"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  }
};
