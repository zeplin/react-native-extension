/* eslint-env node */
require("dotenv").config();
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