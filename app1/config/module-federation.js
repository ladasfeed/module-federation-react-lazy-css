const deps = require('../package.json').dependencies;
const { ModuleFederationPlugin } = require('webpack').container;
const { NodeFederationPlugin, StreamingTargetPlugin } = require('@module-federation/node');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  client: [
  new MiniCssExtractPlugin(),
  new ModuleFederationPlugin({
    name: 'app1',
    filename: 'remoteEntry.js',
    remotes: {
      app2: 'app2@http://localhost:3001/static/remoteEntry.js',
    },
    shared: [{ react: {
      eager: true,
      singleton: true,
      version: deps.react
    }, 'react-dom': deps['react-dom'], 'react-helmet': {
      singleton: true
    } }],
  })
],
  server: [
    new MiniCssExtractPlugin(),
    new NodeFederationPlugin({
      name: 'app1',
      library: { type: 'commonjs-module' },
      filename: 'remoteEntry.js',
      remotes: {
        app2: 'app2@http://localhost:3001/server/remoteEntry.js',
      },
      shared: [{ react: deps.react, 'react-dom': deps['react-dom'], 'react-helmet': {
        singleton: true
      } }],
    }),
    new StreamingTargetPlugin({
      name: 'app1',
      library: { type: 'commonjs-module' },
      remotes: {
        app2: 'app2@http://localhost:3001/server/remoteEntry.js',
      },
    }),
  ],
};
