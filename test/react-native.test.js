/* eslint-env jest */
/* global __dirname */
const path = require("path");
const {
    Layer,
    Color,
    Project,
    TextStyle,
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

tests.forEach(singleTest => {
    const project = new Project(singleTest.projectData);

    const context = new Context({
        options: getDefaultOptionsFromManifest(manifest),
        project
    });

    singleTest.specs.forEach(spec => {
        describe(`layer tests`, () => {
            test(spec.testname, () => {
                if (spec.type === "layer") {
                    const layer = new Layer(spec.data);
                    const expectedOutput = spec.output;
                    const actualOutput = extensionObject.layer(context, layer);
                    expect(actualOutput).toEqual(expectedOutput);
                } else if (spec.type === "textStyles") {
                    const textStyles = spec.data.map(textStyleData => new TextStyle(textStyleData));
                    const codeData = extensionObject.styleguideTextStyles(context, textStyles);
                    expect(codeData).toEqual(spec.output);
                } else if (spec.type === "colors") {
                    const colors = spec.data.map(color => new Color(color));
                    const codeData = extensionObject.styleguideColors(context, colors);
                    expect(codeData).toEqual(spec.output);
                }
            });
        });
    });
});
