
import {
    blendColors,
    generateName,
    isHtmlTag,
    round,
    selectorize,
    toHexString,
    toRGBAString,
    toHexString,
    layerHasGradient,
    layerHasBlendMode
} from "./util";

var REACT_RULES_WITH_COLOR = [
    "backgroundColor", "borderColor", "color", "shadowColor", "textDecorationColor", "textShadowColor"
];

function generateReactRule(styleObj, projectColorMap, mixin) {
    var selector = styleObj.selector;
    delete styleObj.selector;

    Object.keys(styleObj).forEach(function (prop) {
        if (prop === "mixinEntry") {
            return;
        }

        if (REACT_RULES_WITH_COLOR.includes(prop) && styleObj[prop] in projectColorMap) {
            styleObj[prop] = "colors." + projectColorMap[styleObj[prop]];
        }
    });

    // TODO: how to mixin?
    return "const " + generateName(selector, "camelCase") + " = " +
        JSON.stringify(styleObj, null, 2)
            .replace(/"(.+)":/g, "$1:")
            .replace(/: "colors\.(.*)"/g, ": colors.$1") + ";";
}

function generateColorStyleObject(color, colorFormat) {
    if (!color || !("r" in color && "g" in color && "b" in color && "a" in color)) {
        return;
    }

    switch (colorFormat) {
        case "hex":
            return toHexString(color);

        case "rgb":
            return toRGBAString(color);

        case "hsl":
            return toHSLAString(color);

        case "default":
        default:
            return color.a < 1 ? toRGBAString(color) : toHexString(color);
    }
}

function generateShadowStyleObject(shadow, projectType, layerType, densityDivisor, colorFormat) {
    if (layerType === "text") {
        return {
            textShadowColor: generateColorStyleObject(shadow.color, colorFormat),
            textShadowOffset: {
                width: round(shadow.offsetX / densityDivisor, 1),
                height: round(shadow.offsetY / densityDivisor, 1)
            },
            textShadowRadius: round(shadow.blurRadius / densityDivisor, 1)
        };
    }

    if (projectType === "android") {
        /* return {
            elevation: "something"
        };*/
        return {};
    }

    // iOS doesn't have shadow spread
    return {
        shadowColor: generateColorStyleObject(shadow.color, colorFormat),
        shadowOffset: {
            width: round(shadow.offsetX / densityDivisor, 1),
            height: round(shadow.offsetY / densityDivisor, 1)
        },
        shadowRadius: round(shadow.blurRadius / densityDivisor, 1),
        shadowOpacity: 1.0
    };
}

function generateBorderStyleObject(border, layerType, densityDivisor, colorFormat) {
    if (layerType === "text") {
        return {};
    }

    if (border.fill.type === "gradient") {
        return {};
    }

    return {
        borderStyle: "solid",
        borderWidth: round(border.thickness / densityDivisor, 1),
        borderColor: generateColorStyleObject(border.fill.color, colorFormat)
    };
}

function generateTextLayerStyleObject(layer, font, densityDivisor, colorFormat, defaultValues, layerStyle) {
    var styles = generateTextStyleStyleObject(font, densityDivisor, colorFormat, defaultValues, layerStyle);

    if (layer.fills.length && !layer.hasGradient()) {
        delete styles.color;

        var blentColor = blendColors(layer.fills.map(function (fill) {
            return fill.color;
        }));

        if (font.color) {
            blentColor = blentColor.blend(font.color);
        }

        styles.color = generateColorStyleObject(blentColor, colorFormat);
    }

    return styles;
}

function generateLayerStyleObject(layer, projectType, densityDivisor, showDimensions, colorFormat, defaultValues) {
    /* eslint-enable dot-notation, quote-props, complexity */
    var layerType = layer.type;

    var styles = {
        selector: selectorize(layer.name) || ".layer"
    };

    if (showDimensions) {
        styles.width = round(layer.rect.width / densityDivisor, 1);
        styles.height = round(layer.rect.height / densityDivisor, 1);
    }

    // object fit: https://github.com/acdlite/react-object-fit-cover

    if (layer.rotation) {
        styles.transform = "rotate(" + (-layer.rotation) + "deg)";
    }

    if (layer.opacity !== 1) {
        styles.opacity = round(layer.opacity, 2);
    }

    // blend mode: https://github.com/CAPSLOCKUSER/gl-react-color-blending

    if (layer.borderRadius) {
        styles.borderRadius = round(layer.borderRadius / densityDivisor, 1);
    }

    // blur: https://github.com/react-native-community/react-native-blur

    if (layerType === "text") {
        var defaultTextStyle = layer.defaultTextStyle,
            textStyle = defaultTextStyle && generateTextLayerStyleObject(layer, defaultTextStyle, densityDivisor, colorFormat, defaultValues);

        if (textStyle) {
            // Do not overwrite the selector name
            delete textStyle.selector;
            Object.assign(styles, textStyle);
        }
    } else if (layer.fills.length && !layerHasGradient(layer) && !layerHasBlendMode(layer)) {
        // gradient: https://github.com/react-native-community/react-native-linear-gradient

        styles.backgroundColor = generateColorStyleObject(blendColors(layer.fills.map(function (fill) {
            return fill.color;
        })), colorFormat);
    }

    if (layer.shadows.length) {
        // multiple shadows can only be achieved with multiple views
        Object.assign(styles, generateShadowStyleObject(layer.shadows[layer.shadows.length - 1], projectType, layerType, densityDivisor, colorFormat));
    }

    if (layer.borders.length) {
        Object.assign(styles, generateBorderStyleObject(layer.borders[layer.borders.length - 1], layerType, densityDivisor, colorFormat));
    }

    return styles;
}

function generateTextStyleStyleObject(textStyle, densityDivisor, colorFormat, defaultValues, layerStyle) {
    var selector = selectorize(textStyle.name);
    if (!isHtmlTag(selector)) {
        selector = selector.substring(1);
    }

    var styleProperties = {
        selector: selector
    };
    var overrideLayerStyle;

    styleProperties.fontFamily = textStyle.fontFamily;
    styleProperties.fontSize = round(textStyle.fontSize / densityDivisor, 1);

    overrideLayerStyle = layerStyle && layerStyle["font-weight"] && layerStyle["font-weight"] !== "normal";
    if (textStyle.fontWeight === 700) {
        styleProperties.fontWeight = "bold";
    } else if (textStyle.fontWeight !== 400) {
        styleProperties.fontWeight = String(textStyle.fontWeight);
    } else if (defaultValues || overrideLayerStyle) {
        styleProperties.fontWeight = "normal";
    }

    overrideLayerStyle = layerStyle && layerStyle["font-style"] && layerStyle["font-style"] !== "normal";
    if (textStyle.fontStyle && (textStyle.fontStyle !== "normal" || defaultValues || overrideLayerStyle)) {
        styleProperties.fontStyle = textStyle.fontStyle;
    }

    // If this is a child text style, then it will simply be inherited if it doesn't have any explicit value
    // and if we want to revert it to its default value, we need to give the base line height (≈ font size * 1.2)
    // value explicitly. Non-existence of line height, doesn't mean that it should be reverted back.
    // Besides, Sketch doesn't allow child text styles to override parent line height, whereas Ps and Ai
    // allows but it doesn't affect text rendering, so it's practically useless.
    if (textStyle.lineHeight) {
        styleProperties.lineHeight = round(textStyle.lineHeight / densityDivisor, 1);
    }

    overrideLayerStyle = layerStyle && layerStyle["letter-spacing"] && layerStyle["letter-spacing"] !== "normal";
    if (textStyle.letterSpacing) {
        styleProperties.letterSpacing = round(textStyle.letterSpacing / densityDivisor, 2);
    } else if (defaultValues || overrideLayerStyle) {
        styleProperties.letterSpacing = 0;
    }

    if (textStyle.textAlign) {
        styleProperties.textAlign = textStyle.textAlign;
    }

    if (textStyle.color) {
        styleProperties.color = generateColorStyleObject(textStyle.color, colorFormat);
    }

    return styleProperties;
}

export {
    generateColorStyleObject,
    generateLayerStyleObject,
    generateTextStyleStyleObject,
    generateReactRule
};
