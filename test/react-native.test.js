const fs = require("fs");
const path = require("path");
const {
    Layer,
    Color,
    Project,
    TextStyle,
    Context
} = require("zeplin-extension-model");
const { bundleName } = require("../config");
const extensionObject = require("../dist/bundle");

const specs = JSON.parse(fs.readFileSync(path.join(__dirname, "./specs.json")));
const project = JSON.parse(fs.readFileSync(path.join(__dirname, "./project.json")));
const tests = [{ specs, project }];
function getDefaultOptionsFromManifest(manifest) {
    return manifest.options.reduce((defaultOptions, option) => {
        defaultOptions[option.id] = option.default;
        return defaultOptions;
    }, {});
}

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "../dist/manifest.json")));

tests.forEach(singleTest => {
    const project = new Project(singleTest.project);

    const context = new Context({
        options: getDefaultOptionsFromManifest(manifest),
        project
    });

    singleTest.specs.forEach(spec => {
        if (spec.data.fills) {
            spec.data.fills = spec.data.fills.map((fill) => {
                fill.type = fill.fillType;
                return fill;
            });
        }
    });

    singleTest.specs.forEach(spec => {
        describe(`layer tests`, () => {
            test(spec.testname, () => {
                if (spec.type === "layer") {
                    const layer = new Layer(spec.data);
                    const expectedOutput = spec.output;
                    const actualOutput = extensionObject.layer(context, layer);
                    expect(actualOutput).toEqual(expectedOutput);
                } else if (spec.type === "textstyles") {
                    const textStyles = spec.data.map((textStyleData) => new TextStyle(textStyleData));
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