const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { StatsWriterPlugin } = require("webpack-stats-plugin")


/**
 * @type {import('webpack').Configuration}
 **/
const webpackConfig = {
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  // stats: 'detailed',
  plugins: [
    new StatsWriterPlugin({
      filename: "stats.json" // Default
    }),
  ],
};

module.exports = webpackConfig;
