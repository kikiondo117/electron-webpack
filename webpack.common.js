const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src/renderer/index.tsx"),
  output: {
    filename: "react.bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: "ts-loader",
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/renderer/index.html",
      templateParameters: {
        injectGlobal: `<script>var global = global || window;</script>`,
      },
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};
