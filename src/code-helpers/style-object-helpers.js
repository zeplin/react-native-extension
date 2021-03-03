import {
    isHtmlTag,
    round,
    selectorize,
    blendColors,
    layerHasGradient,
    layerHasBlendMode,
    generateName
} from "../utils";

import {
    NUMERICAL_FONT_BOLD,
    NUMERICAL_FONT_NORMAL
} from "../constants";

function generateShadowStyleObject(shadow, layerType, context) {
    if (layerType === "text") {
        return {
            textShadowColor: context.getColorValue(shadow.color),
            textShadowOffset: {
                width: round(shadow.offsetX / context.densityDivisor, 1),
                height: round(shadow.offsetY / context.densityDivisor, 1)
            },
            textShadowRadius: round(shadow.blurRadius / context.densityDivisor, 1)
        };
    }

    if (context.platform === "android") {
        return {};
    }

    // "iOS" doesn't have shadow spread
    return {
        shadowColor: context.getColorValue(shadow.color),
        shadowOffset: {
            width: round(shadow.offsetX / context.densityDivisor, 1),
            height: round(shadow.offsetY / context.densityDivisor, 1)
        },
        shadowRadius: round(shadow.blurRadius / context.densityDivisor, 1),
        shadowOpacity: 1.0
    };
}

function generateBorderStyleObject(
    border,
    layerType,
    context
) {
    if (layerType === "text" || (border.fill && border.fill.type === "gradient")) {
        return {};
    }

    return {
        borderStyle: "solid",
        borderWidth: round(border.thickness / context.densityDivisor, 1),
        borderColor: context.getColorValue(border.fill.color)
    };
}

function generateTextLayerStyleObject(layer, context) {
    const font = layer.defaultTextStyle;
    var styles = generateTextStyleStyleObject(font, context);

    if (layer.fills && layer.fills.length && !layerHasGradient(layer)) {
        delete styles.color;

        var blendedColor = blendColors(layer.fills.map(fill => fill.color));

        if (font.color) {
            blendedColor = blendedColor.blend(font.color);
        }

        styles.color = context.getColorValue(blendedColor);
    }

    return styles;
}
/* eslint-disable complexity */
function generateLayerStyleObject(layer, context) {
    var layerType = layer.type;

    var styles = {
        selector: selectorize(layer.name) || ".layer"
    };

    if (context.showDimensions) {
        styles.width = round(layer.rect.width / context.densityDivisor, 1);
        styles.height = round(layer.rect.height / context.densityDivisor, 1);
    }

    if (layer.rotation) {
        styles.transform = `rotate(${-layer.rotation}deg)`;
    }

    if (layer.opacity !== 1) {
        var PRECISION = 2;
        styles.opacity = round(layer.opacity, PRECISION);
    }

    if (layer.borderRadius) {
        styles.borderRadius = round(layer.borderRadius / context.densityDivisor, 1);
    }

    if (layerType === "text" && layer.defaultTextStyle) {
        var textStyle = generateTextLayerStyleObject(layer, context);

        delete textStyle.selector;
        Object.assign(styles, textStyle);
    } else if (layer.fills.length && !layerHasGradient(layer) && !layerHasBlendMode(layer)) {
        styles.backgroundColor = context.getColorValue(blendColors(layer.fills.map(fill => fill.color)));
    }

    if (layer.shadows.length) {
        // Multiple shadows can only be achieved with multiple views
        Object.assign(styles,
            generateShadowStyleObject(layer.shadows[layer.shadows.length - 1], layerType, context)
        );
    }

    if (layer.borders.length) {
        Object.assign(styles,
            generateBorderStyleObject(
                layer.borders[layer.borders.length - 1],
                layerType,
                context
            )
        );
    }

    return styles;
}

function generateTextStyleStyleObject(textStyle, context) {
    var selector = selectorize(textStyle.name);
    if (!isHtmlTag(selector)) {
        selector = selector.substring(1);
    }

    var styleProperties = {
        selector
    };

    styleProperties.fontFamily = textStyle.fontFamily;
    styleProperties.fontSize = round(textStyle.fontSize / context.densityDivisor, 1);

    if (textStyle.fontWeight === NUMERICAL_FONT_BOLD) {
        styleProperties.fontWeight = "bold";
    } else if (textStyle.fontWeight !== NUMERICAL_FONT_NORMAL) {
        styleProperties.fontWeight = String(textStyle.fontWeight);
    } else if (context.defaultValues) {
        styleProperties.fontWeight = "normal";
    }

    if (textStyle.fontStyle && (textStyle.fontStyle !== "normal" || context.defaultValues)) {
        styleProperties.fontStyle = textStyle.fontStyle === "oblique" ? "italic" : textStyle.fontStyle;
    }

    if (textStyle.lineHeight) {
        styleProperties.lineHeight = round(textStyle.lineHeight / context.densityDivisor, 1);
    }

    if (textStyle.letterSpacing) {
        var PRECISION = 2;
        styleProperties.letterSpacing = round(textStyle.letterSpacing / context.densityDivisor, PRECISION);
    } else if (context.defaultValues) {
        styleProperties.letterSpacing = 0;
    }

    if (textStyle.textAlign) {
        styleProperties.textAlign = textStyle.textAlign;
    }

    if (textStyle.color) {
        styleProperties.color = context.getColorValue(textStyle.color);
    }

    return styleProperties;
}

function generateTextStyleCode(textStyle, context) {
    var fontStyles = generateTextStyleStyleObject(textStyle, context);
    var selector = generateName(fontStyles.selector);
    var textStyleCode = {};

    delete fontStyles.selector;

    textStyleCode[selector] = fontStyles;

    return textStyleCode;
}

function generateStyleguideTextStylesObject(textStyles, context) {
    return textStyles.reduce((styles, ts) => {
        var textStyle = generateTextStyleCode(ts, context);
        return Object.assign(styles, textStyle);
    }, {});
}

export {
    generateTextLayerStyleObject,
    generateLayerStyleObject,
    generateStyleguideTextStylesObject
};
