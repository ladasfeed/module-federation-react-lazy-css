const path = require('path');
const { merge } = require('webpack-merge');
const shared = require('./webpack.shared');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const moduleFederationPlugin = require('./module-federation');

/**
 * @type {import('webpack').Configuration}
 **/
const webpackConfig = {
  name: 'server',
  target: false,
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/server/index')],
  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: '[name].js',
    libraryTarget: 'commonjs-module',
  },
  mode: 'production',
  plugins: [new MiniCssExtractPlugin({
    filename: "[name]-[contenthash].css",
  }), ...moduleFederationPlugin.server],
  stats: {
    colors: true,
  },
};

module.exports = merge(shared, webpackConfig);
