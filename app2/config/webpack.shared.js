const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { StatsWriterPlugin } = require("webpack-stats-plugin");

const svgLoader = {
  test: /\.svg$/,
  issuer: /.(js|ts)x?$/,
  oneOf: [
    {
      type: "asset",
      resourceQuery: /url/,
      generator: {
        filename: "mobileImg/[name]_[hash][ext]",
      },
    },
    {
      loader: "@svgr/webpack",
      options: {
        symbolId: `[name][hash:3]`,
        svgoConfig: {
          plugins: [
            {
              name: "removeAttributesBySelector",
              params: {
                selector: "path:not(defs > path)",
                attributes: ["id"],
              },
            },
            {
              name: "removeAttrs",
              params: {
                attrs: ["svg:id", "svg:x", "svg:y"],
              },
            },
            {
              name: "removeViewBox",
              active: false,
            },
            {
              name: "removeEmptyAttrs",
              active: false,
            },
            {
              name: "removeDimensions",
              active: true,
            },
            {
              name: "removeUnknownsAndDefaults",
              active: false,
            },
          ],
        },
      },
    },
  ],
};

const fileLoader = {
  test: /\.(jpe?g|png|gif|cur)$/i,
  type: "asset",
  generator: {
    filename: "img/[name]_[hash][ext]",
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
      svgLoader,
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
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
        exclude: /node_modules/,
      },
    ],
  },
  // stats: 'detailed',
  plugins: [
    new StatsWriterPlugin({
      filename: "stats.json", // Default
    }),
  ],
};

module.exports = webpackConfig;
