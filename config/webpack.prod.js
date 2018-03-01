/* eslint-env node */
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const common = require("./webpack.common");
common.plugins.push(new UglifyJSPlugin({
    sourceMap: true
}));
module.exports = common;