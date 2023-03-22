const deps = require("../package.json").dependencies;
const { ModuleFederationPlugin } = require("webpack").container;
const {
  NodeFederationPlugin,
  StreamingTargetPlugin,
} = require("@module-federation/node");

module.exports = {
  client: new ModuleFederationPlugin({
    name: "app2",
    filename: "remoteEntry.js",
    exposes: {
      "./StringFormatter": "./src/client/components/exposed/StringFormatter",
    },
    remotes: {},
    shared: [
      {
        react: {
          version: deps.react,
          singleton: true,
        },
        "react-dom": deps["react-dom"],
      },
    ],
  }),
  server: [
    new NodeFederationPlugin({
      name: "app2",
      library: { type: "commonjs-module" },
      filename: "remoteEntry.js",
      exposes: {
        "./StringFormatter": "./src/client/components/exposed/StringFormatter",
      },
      remotes: {},
      shared: [
        {
          react: {
            singleton: true,
          },
          "react-dom": {
            singleton: true,
          },
        },
      ],
    }),
    new StreamingTargetPlugin({
      name: "app2",
      library: { type: "commonjs-module" },
      remotes: {},
    }),
  ],
};
