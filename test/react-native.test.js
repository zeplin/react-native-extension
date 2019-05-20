/* eslint-env jest */
/* global __dirname */
const path = require("path");
const {
    Layer,
    Context
} = require("@zeplin/extension-model");
const extensionObject = require("../dist/main");

const specs = require(path.join(__dirname, "./specs.json"));
const projectData = require(path.join(__dirname, "./project.json"));
const manifest = require(path.join(__dirname, "../dist/manifest.json"));

const tests = [{ specs, projectData }];
function getDefaultOptionsFromManifest(man) {
    return man.options.reduce((defaultOptions, option) => {
        defaultOptions[option.id] = option.default;
        return defaultOptions;
    }, {});
}

function createContext(data, type) {
    const contextParams = {
        options: getDefaultOptionsFromManifest(manifest)
    };

    if (type === "project") {
        contextParams.project = data;
    } else if (type === "styleguide") {
        contextParams.styleguide = data;
    }

    return new Context(contextParams);
}

tests.forEach(singleTest => {
    const { projectData: testProjectData } = singleTest;

    singleTest.specs.forEach(spec => {
        describe(`layer tests`, () => {
            test(spec.testname, () => {
                if (spec.type === "layer") {
                    const layer = new Layer(spec.data);
                    const expectedOutput = spec.output;
                    const context = createContext(testProjectData, "project");
                    const actualOutput = extensionObject.layer(context, layer);
                    expect(actualOutput).toEqual(expectedOutput);
                } else if (spec.type === "textStyles") {
                    const projectDataWithTextStyles = Object.assign({}, testProjectData, { textStyles: spec.data });
                    const context = createContext(projectDataWithTextStyles, "project");
                    const codeData = extensionObject.textStyles(context);
                    expect(codeData).toEqual(spec.output);
                } else if (spec.type === "colors") {
                    const projectDataWithColors = Object.assign({}, testProjectData, { colors: spec.data });
                    const context = createContext(projectDataWithColors, "project");
                    const codeData = extensionObject.colors(context);
                    expect(codeData).toEqual(spec.output);
                }
            });
        });
    });
});
