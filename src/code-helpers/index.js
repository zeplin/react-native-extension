import {
    generateColorStyleObject,
    generateLayerStyleObject,
    generateStyleguideTextStylesObject
} from "./style-object-helpers";
import {
    generateName,
    getColorMapByFormat
} from "../utils";

import {
    REACT_RULES_WITH_COLOR,
    JSON_SPACING
} from "../constants";

function generateReactRule(styleObj, projectColorMap, mixin) {
    let selector = styleObj.selector;
    delete styleObj.selector;

    Object.keys(styleObj).forEach(function (prop) {
        if (prop === "mixinEntry") {
            return;
        }

        if (REACT_RULES_WITH_COLOR.includes(prop) && styleObj[prop] in projectColorMap) {
            styleObj[prop] = `colors.${projectColorMap[styleObj[prop]]}`;
        }
    });

    const selectorName = generateName(selector, "camelCase");
    const styleObjText = JSON.stringify(styleObj, null, JSON_SPACING)
        .replace(/"(.+)":/g, "$1:")
        .replace(/: "colors\.(.*)"/g, ": colors.$1");

    return `const ${selectorName} = ${styleObjText};`;
}

function getStyleguideColorTexts(colorFormat, colors) {
    return colors.map(color => {
        const colorStyleObject = generateColorStyleObject(
            color,
            colorFormat
        );
        return `  ${color.name}: "${colorStyleObject}"`;
    });
}

function getStyleguideColorsCode(options, colors) {
    const { colorFormat } = options;
    const styleguideColorTexts = getStyleguideColorTexts(colorFormat, colors);
    return `const colors = {\n${styleguideColorTexts.join(",\n")}\n};`;
}

function getStyleguideTextStylesCode(options, project, textStyles) {
    let textStylesObj = generateStyleguideTextStylesObject(options, project, textStyles);

    let textStylesStr = JSON.stringify(textStylesObj, null, JSON_SPACING);
    const processedTextStyles = textStylesStr.replace(/"(.+)":/g, "$1:").replace(/: "colors\.(.*)"/g, `: colors.$1`);

    return `const textStyles = StyleSheet.create(${processedTextStyles});`;
}

function getLayerCode(options, project, layer) {
    const { showDimensions, colorFormat, defaultValues } = options;

    let layerStyleRule = generateLayerStyleObject({
        layer,
        projectType: project.type,
        densityDivisor: project.densityDivisor,
        showDimensions,
        colorFormat,
        defaultValues
    });

    let cssObjects = [];

    if (Object.keys(layerStyleRule).length > 1) {
        cssObjects.unshift(layerStyleRule);
    }

    return cssObjects.map(cssObj =>
        generateReactRule(
            cssObj,
            getColorMapByFormat(project.colors, options.colorFormat)
        )
    ).join("\n\n");
}

export {
    getStyleguideColorsCode,
    getStyleguideTextStylesCode,
    getLayerCode
};
