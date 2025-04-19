const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");
const { error } = require("console");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    open: true,
    port: 8000,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    compress: true, // mengecilkan ukuran file untuk kinerja aja
  },
});
