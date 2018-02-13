import {
    getStyleguideColorsCode,
    getStyleguideTextStylesCode,
    getLayerCode
} from "./code-helpers";

import { OPTION_NAMES } from "./constants";

function styleguideColors(context, colors) {
    const options = { colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT) };
    const code = getStyleguideColorsCode(options, colors);

    return {
        code: code,
        mode: "javascript",
        options: [OPTION_NAMES.COLOR_FORMAT, OPTION_NAMES.SHOW_DIMENSIONS, OPTION_NAMES.SHOW_DEFAULT_VALUES]
    };
}

function styleguideTextStyles(context, textStyles) {
    const options = {
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        defaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES)
    };
    const code = getStyleguideTextStylesCode(options, context.project, textStyles);

    return {
        code: code,
        mode: "javascript",
        options: [OPTION_NAMES.COLOR_FORMAT, OPTION_NAMES.SHOW_DIMENSIONS, OPTION_NAMES.SHOW_DEFAULT_VALUES]
    };
}

function layer(context, selectedLayer) {
    const options = {
        showDimensions: context.getOption(OPTION_NAMES.SHOW_DIMENSIONS),
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        defaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES)
    };
    const code = getLayerCode(context.project, selectedLayer, options);

    let returnOptions = [OPTION_NAMES.COLOR_FORMAT, OPTION_NAMES.SHOW_DIMENSIONS];

    if (selectedLayer.type === "text") {
        returnOptions.push(OPTION_NAMES.SHOW_DEFAULT_VALUES);
    }

    return {
        code: code,
        mode: "javascript",
        options: returnOptions
    };
}

function comment(context, text) {
    return `// ${text}`;
}

function exportStyleguideColors(context, colors) {
    let codeObject = styleguideColors(context, colors);
    const code = codeObject.code;

    return {
        code: code,
        filename: "colors.js",
        mode: "javascript"
    };
}

function exportStyleguideTextStyles(context, textstyles) {
    let codeObject = styleguideTextStyles(context, textstyles);
    const code = codeObject.code;

    return {
        code: code,
        filename: "fonts.js",
        mode: "javascript"
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
