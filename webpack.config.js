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
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          optional: ['runtime'],
          stage: 0
        }
      }
    ]
  }
};
