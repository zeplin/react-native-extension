import { generateName, getColorMapByFormat } from "./util";
import {
    generateColorStyleObject,
    generateLayerStyleObject,
    generateTextStyleStyleObject,
    generateReactRule
} from "./helpers";
import { OPTION_NAMES } from "./constants";

function generateTextStyleCode(textStyle, params) {
    var fontStyles = generateTextStyleStyleObject(textStyle, params.densityDivisor, params.colorFormat, params.defaultValues);
    var selector = generateName(fontStyles.selector, "camelCase");
    var textStyle = {};

    delete fontStyles.selector;

    if (params.projectColor) {
        fontStyles.color = "colors." + params.projectColor.name;
    }

    textStyle[selector] = fontStyles;

    return textStyle;
}

function styleguideColors(context, colors) {
    var code = "const colors = {\n" +
        colors.map(function (color) {
            return "  " + color.name + ': "' + generateColorStyleObject(color, context.getOption(OPTION_NAMES.COLOR_FORMAT)) + '"';
        }, this).join(",\n") + "\n};";

    return {
        code: code,
        mode: "javascript",
        options: [OPTION_NAMES.COLOR_FORMAT, OPTION_NAMES.SHOW_DIMENSIONS, OPTION_NAMES.SHOW_DEFAULT_VALUES]
    };
}

function styleguideTextStyles(context, textstyles) {
    var params = {
        densityDivisor: context.project.densityDivisor,
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        defaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES)
    };

    var textStyles = textstyles.reduce(function (styles, ts) {
        var tsParams;

        if (ts.color) {
            var projectColor = context.project.findColorEqual(ts.color);

            tsParams = Object.assign({}, params, { projectColor: projectColor });
        } else {
            tsParams = params;
        }

        var textStyle = generateTextStyleCode(ts, tsParams);

        return Object.assign(styles, textStyle);
    }, {});

    textStyles = JSON.stringify(textStyles, null, 2);

    var code = "const textStyles = StyleSheet.create(" +
            textStyles.replace(/"(.+)":/g, "$1:").replace(/: "colors\.(.*)"/g, ": colors.$1") + ");";

    return {
        code: code,
        mode: "javascript",
        options: [OPTION_NAMES.COLOR_FORMAT, OPTION_NAMES.SHOW_DIMENSIONS, OPTION_NAMES.SHOW_DEFAULT_VALUES]
    };
}

function layer(context, selectedLayer) {
    var layerStyleRule = generateLayerStyleObject(selectedLayer, context.project.type, context.project.densityDivisor,
        context.getOption(OPTION_NAMES.SHOW_DIMENSIONS), context.getOption(OPTION_NAMES.COLOR_FORMAT), context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES));
    var cssObjects = [];

    if (Object.keys(layerStyleRule).length > 1) {
        cssObjects.unshift(layerStyleRule);
    }

    layerStyleRule = cssObjects.map(function (cssObj) {
        return generateReactRule(cssObj, getColorMapByFormat(context.project.colors, context.getOption(OPTION_NAMES.COLOR_FORMAT)));
    }).join("\n\n");

    var options = [OPTION_NAMES.COLOR_FORMAT, OPTION_NAMES.SHOW_DIMENSIONS];

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
    return "// " + text;
}

function exportStyleguideColors(context, colors) {
    var codeObject = styleguideColors(context, colors);
    var code = codeObject.code;

    return {
        code: code,
        filename: "colors.js",
        mode: "javascript"
    };
}

function exportStyleguideTextStyles(context, textstyles) {
    var codeObject = styleguideTextStyles(context, textstyles);
    var code = codeObject.code;

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
