var path = require("path"),
  webpack = require("webpack");

module.exports = {
  cache: true,
  entry: "./src/main.js",
  output: {
    filename: "dist/webpack-bundle.js"
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
