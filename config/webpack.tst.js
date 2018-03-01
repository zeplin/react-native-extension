/* eslint-env node */
const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
    output: {
        filename: "[name].js"
    }
});

