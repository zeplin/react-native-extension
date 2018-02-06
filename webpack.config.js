/* eslint-env node */
const path = require("path");
const { moduleURL, bundleName } = require("./config");
const manifestTransformerCreator = require("./build-utils/manifest-transformer");
const SimpleCopyPlugin = require("./build-utils/simple-copy-plugin");

const manifestTransformer = manifestTransformerCreator(moduleURL, bundleName);

const copies = {
    [bundleName]: [
        { from: "./manifest.json", to: "manifest.json", transform: manifestTransformer },
        { from: "./README.md", to: "README.md" }
    ]
};

const config = {
    entry: { [`${bundleName}`]: "./src/index.js" },
    output: {
        path: path.join(__dirname, "dist"),
        filename: process.env.BUILD_TYPE === "test" ? "[name].js" : "[name].[chunkhash:8].js",
        library: "extension",
        libraryExport: "default",
        libraryTarget: "umd"
    },
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
    plugins: [
        new SimpleCopyPlugin(copies)
    ]
};

if (process.env.NODE_ENV !== "prod") {
    config.devtool = "inline-source-map";
}

module.exports = config;