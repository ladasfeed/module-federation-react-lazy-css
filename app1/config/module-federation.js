const deps = require("../package.json").dependencies;
const { ModuleFederationPlugin } = require("webpack").container;
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require("@module-federation/node");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const shared = {
  react: {
    eager: true,
    singleton: true,
  },
  "react-dom": {
    eager: true,
    singleton: true,
  },
  "react-helmet": {
    singleton: true,
  },
};

module.exports = {
  client: [
    new MiniCssExtractPlugin(),
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      remotes: {
        app2: "app2@http://localhost:3001/static/remoteEntry.js",
      },
      shared: [shared],
    }),
  ],
  server: [
    new MiniCssExtractPlugin(),
    new NodeFederationPlugin({
      name: "app1",
      library: { type: "commonjs-module" },
      filename: "remoteEntry.js",
      remotes: {
        app2: "app2@http://localhost:3001/server/remoteEntry.js",
      },
      shared: [shared],
    }),
    new StreamingTargetPlugin({
      name: "app1",
      library: { type: "commonjs-module" },
      remotes: {
        app2: "app2@http://localhost:3001/server/remoteEntry.js",
      },
    }),
  ],
};
