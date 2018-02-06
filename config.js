/* eslint-env node */
let moduleURL;

switch (process.env.NODE_ENV) {
    case "local":
        moduleURL = "http://localhost:8081/dist";
        break;
    case "dev":
        moduleURL = process.env.DEV_URL;
        break;
    case "prod":
        moduleURL = process.env.PROD_URL;
        break;
    default:
        moduleURL = "http://localhost:8081/dist";
        break;
}

module.exports = {
    moduleURL,
    bundleName: "bundle"
};