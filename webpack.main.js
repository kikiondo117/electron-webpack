const path = require("path");

module.exports = {
  mode: "development",
  target: "electron-main",
  entry: {
    main: path.resolve(__dirname, "src/main/main.ts"),
    preload: path.resolve(__dirname, "src/main/preload.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
};
