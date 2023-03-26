const deps = require("../package.json").dependencies;
const { ModuleFederationPlugin } = require("webpack").container;
const { ChunkCorrelationPlugin } = require("@module-federation/node");
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require("@module-federation/node");

const exposes = {
  "./StringFormatter": "./src/client/components/exposed/StringFormatter",
  "./AmazingForm": "./src/client/components/exposed/AmazingForm",
};

const shared = {
  react: {
    singleton: true,
  },
  "react-dom": {
    singleton: true,
  },
  "react-hook-form": {
    singleton: true,
    eager: true,
  },
};

module.exports = {
  client: [
    new ModuleFederationPlugin({
      name: "app2",
      filename: "remoteEntry.js",
      exposes,
      remotes: {},
      shared: [shared],
    }),
    new ChunkCorrelationPlugin({ filename: "federation-stats.json" }),
  ],
  server: [
    new NodeFederationPlugin({
      name: "app2",
      library: { type: "commonjs-module" },
      filename: "remoteEntry.js",
      exposes,
      remotes: {},
      shared: [shared],
    }),
    new StreamingTargetPlugin({
      name: "app2",
      library: { type: "commonjs-module" },
      remotes: {},
    }),
  ],
};
