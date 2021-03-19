import {
    generateLayerStyleObject,
    generateStyleguideTextStylesObject
} from "./style-object-helpers";
import { generateName, getColorStringByFormat } from "../utils";

import { JSON_SPACING } from "../constants";

function stringifyStyleObject(obj) {
    return JSON.stringify(obj, null, JSON_SPACING)
        .replace(/"(.+)":/g, "$1:")
        .replace(/: "colors\.(.*)"/g, ": colors.$1")
        .replace(/: "colors\[\\"(.*)\\"]"/g, ": colors[\"$1\"]");
}

function generateReactRule(styleObj, selector) {
    var selectorName = generateName(selector);
    var styleObjText = stringifyStyleObject(styleObj, null, JSON_SPACING);

    return `const ${selectorName} = ${styleObjText};`;
}

function getStyleguideColorTexts(colors, { colorFormat, tokenNameFormat }) {
    return colors.map(color => {
        const colorName = generateName(color.originalName || color.name, tokenNameFormat);
        const colorValue = getColorStringByFormat(color, colorFormat);
        return `  ${colorName}: "${colorValue}"`;
    });
}

function getStyleguideColorsCode(colors, context) {
    var styleguideColorTexts = getStyleguideColorTexts(colors, context);
    return `const colors = {\n${styleguideColorTexts.join(",\n")}\n};`;
}

function getStyleguideTextStylesCode(textStyles, context) {
    var textStylesObj = generateStyleguideTextStylesObject(textStyles, context);

    var processedTextStyles = stringifyStyleObject(textStylesObj);

    return `const textStyles = StyleSheet.create(${processedTextStyles});`;
}

function getLayerCode(layer, context) {
    var layerStyleRule = generateLayerStyleObject(layer, context);
    return (
        Object.keys(layerStyleRule).length > 0
            ? generateReactRule(layerStyleRule, layer.name || "layer")
            : ""
    );
}

export {
    getStyleguideColorsCode,
    getStyleguideTextStylesCode,
    getLayerCode
};
