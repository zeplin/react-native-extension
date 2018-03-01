/* eslint-env node */
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

let moduleURL;

switch (process.env.NODE_ENV) {
    case "local":
        moduleURL = process.env.MODULE_URL_LOCAL;
        break;
    case "dev":
        moduleURL = process.env.MODULE_URL_DEV;
        break;
    case "prod":
        moduleURL = process.env.MODULE_URL_PROD;
        break;
    default:
        throw new Error("Invalid Environment");
}

module.exports = {
    moduleURL,
    bundleName: "bundle"
};