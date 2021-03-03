import {
    getStyleguideColorsCode,
    getStyleguideTextStylesCode,
    getLayerCode
} from "./code-helpers";
import { OPTION_NAMES } from "./constants";
import { getResourceContainer, Context } from "./utils";

function colors(context) {
    const wrappedContext = new Context(context);
    var allColors = wrappedContext.getResources("colors");
    var code = getStyleguideColorsCode(allColors, wrappedContext);

    return {
        code: code,
        language: "javascript"
    };
}

function textStyles(context) {
    const wrappedContext = new Context(context);
    var allTextStyles = wrappedContext.getResources("textStyles");
    var code = getStyleguideTextStylesCode(allTextStyles, wrappedContext);

    return {
        code: code,
        language: "javascript"
    };
}

function layer(context, selectedLayer) {
    const wrappedContext = new Context(context);
    var code = getLayerCode(selectedLayer, wrappedContext);

    return {
        code: code,
        language: "javascript"
    };
}

function comment(context, text) {
    return `// ${text}`;
}

function exportColors(context) {
    var codeObject = colors(context);
    var code = codeObject.code;

    return {
        code: code,
        filename: "colors.js",
        language: "javascript"
    };
}

function exportTextStyles(context) {
    var codeObject = textStyles(context);
    var code = codeObject.code;

    return {
        code: code,
        filename: "fonts.js",
        language: "javascript"
    };
}

function styleguideColors(context, colorsInProject) {
    const wrappedContext = new Context(context);
    var code = getStyleguideColorsCode(colorsInProject, wrappedContext);
    return {
        code,
        language: "javascript"
    };
}

function styleguideTextStyles(context, textStylesInProject) {
    const wrappedContext = new Context(context);
    var code = getStyleguideTextStylesCode(textStylesInProject, wrappedContext);
    return {
        code,
        language: "javascript"
    };
}

function exportStyleguideColors(context, colorsInProject) {
    var codeObject = styleguideColors(context, colorsInProject);
    var code = codeObject.code;
    return {
        code,
        filename: "colors.js",
        language: "javascript"
    };
}

function exportStyleguideTextStyles(context, textStylesInProject) {
    var codeObject = styleguideTextStyles(context, textStylesInProject);
    var code = codeObject.code;
    return {
        code,
        filename: "fonts.js",
        language: "javascript"
    };
}

export default {
    layer,
    colors,
    textStyles,
    comment,
    exportColors,
    exportTextStyles,
    styleguideColors,
    styleguideTextStyles,
    exportStyleguideColors,
    exportStyleguideTextStyles
};
