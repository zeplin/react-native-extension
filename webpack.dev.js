/* eslint-env node */
const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
    devServer: {
        port: 8081,
        publicPath: "/dist",
        watchContentBase: true,
        disableHostCheck: true,
        headers: {
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Range",
            "Access-Control-Allow-Origin": "*"
        },
        hot: false,
        inline: false
    },
    devtool: "inline-source-map"
});

