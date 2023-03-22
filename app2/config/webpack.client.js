const path = require("path");
const { merge } = require("webpack-merge");
const shared = require("./webpack.shared");
// const moduleFederationPlugin = require("./module-federation");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ChunkCorrelationPlugin } = require("@module-federation/node");
const { ModuleFederationPlugin } = require("webpack").container;

/**
 * @type {import('webpack').Configuration}
 **/
const webpackConfig = {
  name: "client",
  target: "web",
  entry: ["@babel/polyfill", path.resolve(__dirname, "../src/client/index")],
  mode: "development",
  output: {
    path: path.resolve(__dirname, "../dist/client"),
    filename: "[name].js",
    chunkFilename: "[name].js",
    // publicPath: 'http://localhost:3001/static/',
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]-[contenthash].css",
    }),
    new ModuleFederationPlugin({
      name: "app2",
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

    new ChunkCorrelationPlugin({ filename: "federation-stats.json" }),
  ],
};

module.exports = merge(shared, webpackConfig);
