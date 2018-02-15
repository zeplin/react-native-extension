/* eslint-env node */
module.exports = function (moduleURL, bundleName) {
    return function (content, filename) {
        const obj = JSON.parse(content);
        Object.assign(
            obj,
            {
                moduleURL: moduleURL + "/" + filename,
                readmeURL: moduleURL + "/README.md"
            }
        );
        delete obj.output;
        return JSON.stringify(obj);
    };
};