/* eslint-env node */
const path = require("path");
const { moduleURL, bundleName } = require("./config");
const manifestTransformerCreator = require("../build-utils/manifest-transformer");
const SimpleCopyPlugin = require("../build-utils/simple-copy-plugin");

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
        path: path.join(process.cwd(), "dist"),
        publicPath: "/",
        filename: "[name].[chunkhash:8].js",
        library: "extension",
        libraryExport: "default",
        libraryTarget: "umd"
    },
    plugins: [
        new SimpleCopyPlugin(copies)
    ]
};

module.exports = config;