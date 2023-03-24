const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const fileLoader = {
  test: /\.(jpe?g|png|gif|cur)$/i,
  type: "asset",
  generator: {
    filename: "mobileImg/[name]_[hash][ext]",
  },
  use: [
    {
      loader: "image-webpack-loader",
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65,
        },
        gifsicle: {
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        pngquant: {
          quality: [0.65, 0.9],
          speed: 4,
        },
      },
    },
  ],
  exclude: [/node_modules/],
};
/**
 * @type {import('webpack').Configuration}
 **/
const webpackConfig = {
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      fileLoader,
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|ts)x?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = webpackConfig;
