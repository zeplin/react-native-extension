import {
    getStyleguideColorsCode,
    getStyleguideTextStylesCode,
    getLayerCode
} from "./code-helpers";

import { OPTION_NAMES } from "./constants";

function styleguideColors(context, colors) {
    var options = { colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT) };
    var code = getStyleguideColorsCode(options, colors);

    return {
        code: code,
        language: "javascript"
    };
}

function styleguideTextStyles(context, textStyles) {
    var options = {
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        defaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES)
    };
    var code = getStyleguideTextStylesCode(options, context.project, textStyles);

    return {
        code: code,
        language: "javascript"
    };
}

function layer(context, selectedLayer) {
    var options = {
        showDimensions: context.getOption(OPTION_NAMES.SHOW_DIMENSIONS),
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        defaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES)
    };
    var code = getLayerCode(context.project, selectedLayer, options);

    return {
        code: code,
        language: "javascript"
    };
}

function comment(context, text) {
    return `// ${text}`;
}

function exportStyleguideColors(context, colors) {
    var codeObject = styleguideColors(context, colors);
    var code = codeObject.code;

    return {
        code: code,
        filename: "colors.js",
        language: "javascript"
    };
}

function exportStyleguideTextStyles(context, textstyles) {
    var codeObject = styleguideTextStyles(context, textstyles);
    var code = codeObject.code;

    return {
        code: code,
        filename: "fonts.js",
        language: "javascript"
    };
}

export default {
    layer,
    styleguideColors,
    styleguideTextStyles,
    comment,
    exportStyleguideColors,
    exportStyleguideTextStyles
};
