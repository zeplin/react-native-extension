import {
    generateLayerStyleObject,
    generateStyleguideTextStylesObject
} from "./style-object-helpers";
import {
    generateName,
    getColorMapByFormat,
    getColorStringByFormat,
    getResources
} from "../utils";

import { REACT_RULES_WITH_COLOR, JSON_SPACING } from "../constants";

function generateReactRule(styleObj) {
    var selector = styleObj.selector;
    delete styleObj.selector;

    var selectorName = generateName(selector);
    var styleObjText = JSON.stringify(styleObj, null, JSON_SPACING)
        .replace(/"(.+)":/g, "$1:")
        .replace(/: "colors\.(.*)"/g, ": colors.$1");

    return `const ${selectorName} = ${styleObjText};`;
}

function getStyleguideColorTexts(colors, colorFormat) {
    return colors.map(color => `  ${color.getFormattedName("constant")}: "${getColorStringByFormat(color, colorFormat)}"`);
}

function getStyleguideColorsCode(colors, context) {
    var styleguideColorTexts = getStyleguideColorTexts(colors, context.colorFormat);
    return `const colors = {\n${styleguideColorTexts.join(",\n")}\n};`;
}

function getStyleguideTextStylesCode(textStyles, context) {
    var textStylesObj = generateStyleguideTextStylesObject(textStyles, context);

    var textStylesStr = JSON.stringify(textStylesObj, null, JSON_SPACING);
    var processedTextStyles = textStylesStr.replace(/"(.+)":/g, "$1:").replace(/: "colors\.(.*)"/g, ": colors.$1");

    return `const textStyles = StyleSheet.create(${processedTextStyles});`;
}

function getLayerCode(layer, context) {
    var layerStyleRule = generateLayerStyleObject(layer, context);
    return Object.keys(layerStyleRule).length > 1 ? generateReactRule(layerStyleRule) : "";
}

export {
    getStyleguideColorsCode,
    getStyleguideTextStylesCode,
    getLayerCode
};
