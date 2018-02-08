import { getColorMapByFormat, generateName } from "./utils";
import {
    generateColorStyleObject,
    generateLayerStyleObject,
    generateTextStyleStyleObject,
    generateReactRule
} from "./helpers";
import { OPTION_NAMES, JSON_SPACE_AMOUNT } from "./constants";

function generateTextStyleCode(textStyle, params) {
    let fontStyles = generateTextStyleStyleObject({
        textStyle,
        densityDivisor: params.densityDivisor,
        colorFormat: params.colorFormat,
        defaultValues: params.defaultValues
    });
    let selector = generateName(fontStyles.selector, "camelCase");
    let textStyleCode = {};

    delete fontStyles.selector;

    if (params.projectColor) {
        fontStyles.color = `colors.${params.projectColor.name}`;
    }

    textStyleCode[selector] = fontStyles;

    return textStyleCode;
}

function getStyleguideColorTexts(context, colors) {
    return colors.map(color => {
        const colorStyleObject = generateColorStyleObject(
            color,
            context.getOption(OPTION_NAMES.COLOR_FORMAT)
        );
        return `  ${color.name}: "${colorStyleObject}"`;
    });
}

function styleguideColors(context, colors) {
    const styleguideColorTexts = getStyleguideColorTexts(context, colors);
    let code = `const colors = {\n${styleguideColorTexts.join(",\n")}\n};`;

    return {
        code: code,
        mode: "javascript",
        options: [OPTION_NAMES.COLOR_FORMAT, OPTION_NAMES.SHOW_DIMENSIONS, OPTION_NAMES.SHOW_DEFAULT_VALUES]
    };
}

function getStyleguideTextStyles(context, textstyles) {
    const params = {
        densityDivisor: context.project.densityDivisor,
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        defaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES)
    };

    return textstyles.reduce((styles, ts) => {
        let tsParams;
        if (ts.color) {
            let projectColor = context.project.findColorEqual(ts.color);
            tsParams = Object.assign({}, params, { projectColor });
        } else {
            tsParams = params;
        }

        let textStyle = generateTextStyleCode(ts, tsParams);
        return Object.assign(styles, textStyle);
    }, {});
}

function processTextStyles(textStyles) {
    return textStyles.replace(/"(.+)":/g, "$1:").replace(/: "colors\.(.*)"/g, `: colors.$1`);
}

function styleguideTextStyles(context, textstyles) {
    let textStyles = getStyleguideTextStyles(context, textstyles);

    textStyles = JSON.stringify(textStyles, null, JSON_SPACE_AMOUNT);
    const processedTextStyles = processTextStyles(textStyles);

    let code = `const textStyles = StyleSheet.create(${processedTextStyles});`;

    return {
        code: code,
        mode: "javascript",
        options: [OPTION_NAMES.COLOR_FORMAT, OPTION_NAMES.SHOW_DIMENSIONS, OPTION_NAMES.SHOW_DEFAULT_VALUES]
    };
}

function layer(context, selectedLayer) {
    let layerStyleRule = generateLayerStyleObject({
        layer: selectedLayer,
        projectType: context.project.type,
        densityDivisor: context.project.densityDivisor,
        showDimensions: context.getOption(OPTION_NAMES.SHOW_DIMENSIONS),
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        defaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES)
    });

    let cssObjects = [];

    if (Object.keys(layerStyleRule).length > 1) {
        cssObjects.unshift(layerStyleRule);
    }

    layerStyleRule = cssObjects.map(function (cssObj) {
        return generateReactRule(
            cssObj,
            getColorMapByFormat(context.project.colors, context.getOption(OPTION_NAMES.COLOR_FORMAT))
        );
    }).join("\n\n");

    let options = [OPTION_NAMES.COLOR_FORMAT, OPTION_NAMES.SHOW_DIMENSIONS];

    if (selectedLayer.type === "text") {
        options.push(OPTION_NAMES.SHOW_DEFAULT_VALUES);
    }

    return {
        code: layerStyleRule,
        mode: "javascript",
        options: options
    };
}

function comment(context, text) {
    return `// ${text}`;
}

function exportStyleguideColors(context, colors) {
    let codeObject = styleguideColors(context, colors);
    let code = codeObject.code;

    return {
        code: code,
        filename: "colors.js",
        mode: "javascript"
    };
}

function exportStyleguideTextStyles(context, textstyles) {
    let codeObject = styleguideTextStyles(context, textstyles);
    let code = codeObject.code;

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
