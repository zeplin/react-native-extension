import {
    isHtmlTag,
    round,
    selectorize,
    blendColors,
    layerHasGradient,
    layerHasBlendMode,
    generateName,
    getColorStringByFormat
} from "../utils";

import {
    NUMERICAL_FONT_BOLD,
    NUMERICAL_FONT_NORMAL
} from "../constants";

function generateShadowStyleObject({
    shadow,
    platform,
    layerType,
    densityDivisor,
    getColorValue
}) {
    if (layerType === "text") {
        return {
            textShadowColor: getColorValue(shadow.color),
            textShadowOffset: {
                width: round(shadow.offsetX / densityDivisor, 1),
                height: round(shadow.offsetY / densityDivisor, 1)
            },
            textShadowRadius: round(shadow.blurRadius / densityDivisor, 1)
        };
    }

    if (platform === "android") {
        return {};
    }

    // "iOS" doesn't have shadow spread
    return {
        shadowColor: getColorValue(shadow.color),
        shadowOffset: {
            width: round(shadow.offsetX / densityDivisor, 1),
            height: round(shadow.offsetY / densityDivisor, 1)
        },
        shadowRadius: round(shadow.blurRadius / densityDivisor, 1),
        shadowOpacity: 1.0
    };
}

function generateBorderStyleObject(border, layerType, densityDivisor, getColorValue) {
    if (layerType === "text" || (border.fill && border.fill.type === "gradient")) {
        return {};
    }

    return {
        borderStyle: "solid",
        borderWidth: round(border.thickness / densityDivisor, 1),
        borderColor: getColorValue(border.fill.color)
    };
}

function generateTextLayerStyleObject({
    layer,
    font,
    densityDivisor,
    defaultValues,
    layerStyle,
    getColorValue
}) {
    var styles = generateTextStyleStyleObject({
        textStyle: font,
        densityDivisor,
        defaultValues,
        layerStyle,
        getColorValue
    });

    if (layer.fills && layer.fills.length && !layerHasGradient(layer)) {
        delete styles.color;

        var blendedColor = blendColors(layer.fills.map(fill => fill.color));

        if (font.color) {
            blendedColor = blendedColor.blend(font.color);
        }

        styles.color = getColorValue(blendedColor);
    }

    return styles;
}
/* eslint-disable complexity */
function generateLayerStyleObject({
    layer,
    platform,
    densityDivisor,
    showDimensions,
    defaultValues,
    getColorValue
}) {
    var layerType = layer.type;

    var styles = {
        selector: selectorize(layer.name) || ".layer"
    };

    if (showDimensions) {
        styles.width = round(layer.rect.width / densityDivisor, 1);
        styles.height = round(layer.rect.height / densityDivisor, 1);
    }

    if (layer.rotation) {
        styles.transform = `rotate(${-layer.rotation}deg)`;
    }

    if (layer.opacity !== 1) {
        var PRECISION = 2;
        styles.opacity = round(layer.opacity, PRECISION);
    }

    if (layer.borderRadius) {
        styles.borderRadius = round(layer.borderRadius / densityDivisor, 1);
    }

    if (layerType === "text" && layer.defaultTextStyle) {
        var textStyle = generateTextLayerStyleObject({
            layer,
            font: layer.defaultTextStyle,
            densityDivisor,
            defaultValues,
            getColorValue
        });

        delete textStyle.selector;
        Object.assign(styles, textStyle);
    } else if (layer.fills.length && !layerHasGradient(layer) && !layerHasBlendMode(layer)) {
        styles.backgroundColor = getColorValue(blendColors(layer.fills.map(fill => fill.color)));
    }

    if (layer.shadows.length) {
        // Multiple shadows can only be achieved with multiple views
        Object.assign(styles,
            generateShadowStyleObject({
                shadow: layer.shadows[layer.shadows.length - 1],
                platform,
                layerType,
                densityDivisor,
                getColorValue
            })
        );
    }

    if (layer.borders.length) {
        Object.assign(styles,
            generateBorderStyleObject(
                layer.borders[layer.borders.length - 1],
                layerType,
                densityDivisor,
                getColorValue
            )
        );
    }

    return styles;
}

function generateTextStyleStyleObject({
    textStyle,
    densityDivisor,
    defaultValues,
    layerStyle,
    getColorValue
}) {
    var selector = selectorize(textStyle.name);
    if (!isHtmlTag(selector)) {
        selector = selector.substring(1);
    }

    var styleProperties = {
        selector
    };
    var overrideLayerStyle;

    styleProperties.fontFamily = textStyle.fontFamily;
    styleProperties.fontSize = round(textStyle.fontSize / densityDivisor, 1);

    overrideLayerStyle = layerStyle && layerStyle["font-weight"] && layerStyle["font-weight"] !== "normal";
    if (textStyle.fontWeight === NUMERICAL_FONT_BOLD) {
        styleProperties.fontWeight = "bold";
    } else if (textStyle.fontWeight !== NUMERICAL_FONT_NORMAL) {
        styleProperties.fontWeight = String(textStyle.fontWeight);
    } else if (defaultValues || overrideLayerStyle) {
        styleProperties.fontWeight = "normal";
    }

    overrideLayerStyle = layerStyle && layerStyle["font-style"] && layerStyle["font-style"] !== "normal";
    if (textStyle.fontStyle && (textStyle.fontStyle !== "normal" || defaultValues || overrideLayerStyle)) {
        styleProperties.fontStyle = textStyle.fontStyle === "oblique" ? "italic" : textStyle.fontStyle;
    }

    if (textStyle.lineHeight) {
        styleProperties.lineHeight = round(textStyle.lineHeight / densityDivisor, 1);
    }

    overrideLayerStyle = layerStyle && layerStyle["letter-spacing"] && layerStyle["letter-spacing"] !== "normal";
    if (textStyle.letterSpacing) {
        var PRECISION = 2;
        styleProperties.letterSpacing = round(textStyle.letterSpacing / densityDivisor, PRECISION);
    } else if (defaultValues || overrideLayerStyle) {
        styleProperties.letterSpacing = 0;
    }

    if (textStyle.textAlign) {
        styleProperties.textAlign = textStyle.textAlign;
    }

    if (textStyle.color) {
        styleProperties.color = getColorValue(textStyle.color);
    }

    return styleProperties;
}

function generateTextStyleCode(textStyle, params) {
    var fontStyles = generateTextStyleStyleObject({
        textStyle,
        densityDivisor: params.densityDivisor,
        getColorValue: params.getColorValue,
        defaultValues: params.defaultValues
    });
    var selector = generateName(fontStyles.selector);
    var textStyleCode = {};

    delete fontStyles.selector;

    textStyleCode[selector] = fontStyles;

    return textStyleCode;
}

function generateStyleguideTextStylesObject(options, containerAndType, textStyles) {
    var { container } = containerAndType;

    function getColorValue(color) {
        const matchedColor = container.findColorEqual(color, options.useLinkedStyleguides);
        if (matchedColor) {
            return `colors.${matchedColor.getFormattedName("constant")}`;
        }
        return getColorStringByFormat(color, options.colorFormat);
    }

    var params = {
        densityDivisor: container.densityDivisor,
        getColorValue,
        defaultValues: options.defaultValues
    };

    return textStyles.reduce((styles, ts) => {
        var textStyle = generateTextStyleCode(ts, params);
        return Object.assign(styles, textStyle);
    }, {});
}

export {
    generateTextLayerStyleObject,
    generateLayerStyleObject,
    generateStyleguideTextStylesObject
};
