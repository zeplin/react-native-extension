import {
    MAX_BRIGHTNESS,
    HEX_BASE,
    HUE_MAX_DEGREE,
    MAX_PERCENTAGE
} from "../constants";

const alphaFormatter = new Intl.NumberFormat("en-US", {
    useGrouping: false,
    maximumFractionDigits: 2
});

function toHex(num) {
    let hexNum = Math.trunc(num + num / MAX_BRIGHTNESS);
    hexNum = Math.max(0, Math.min(hexNum, MAX_BRIGHTNESS));
    return (hexNum < HEX_BASE ? "0" : "") + hexNum.toString(HEX_BASE);
}

function blendColors(colors) {
    return colors.reduce((blendedColor, color) => blendedColor.blend(color));
}

function getColorStringByFormat(color, colorFormat) {
    if (!("r" in color && "g" in color && "b" in color && "a" in color)) {
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

function getColorMapByFormat(colors, colorFormat) {
    return colors.reduce((colorMap, color) => {
        let colorString = getColorStringByFormat(color, colorFormat);
        colorMap[colorString] = color.name;
        return colorMap;
    }, {});
}

function toHexString(color, prefix) {
    let hexCode = color.hexBase();

    if (color.a < 1) {
        let hexA = toHex(color.a * MAX_BRIGHTNESS);

        hexCode = prefix ? (hexA + hexCode) : (hexCode + hexA);
    }

    return `#${hexCode}`;
}

function toRGBAString(color) {
    let rgb = `${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}`;

    let rgbStr = color.a < 1
        ? `rgba(${rgb}, ${alphaFormatter.format(color.a)})`
        : `rgb(${rgb})`;

    return rgbStr;
}

function toHSLAString(color) {
    let hslColor = color.toHSL();
    let hsl = `${Math.round(hslColor.h * HUE_MAX_DEGREE)}, ` +
              `${Math.round(hslColor.s * MAX_PERCENTAGE)}%, ` +
              `${Math.round(hslColor.l * MAX_PERCENTAGE)}%`;

    let hslStr = color.a < 1
        ? `hsla(${hsl}, ${alphaFormatter.format(color.a)})`
        : `hsl(${hsl})`;

    return hslStr;
}

function toDefaultString(color) {
    return color.a < 1 ? toRGBAString(color) : toHexString(color);
}

export {
    blendColors,
    getColorMapByFormat,
    toHexString,
    toRGBAString,
    toHSLAString,
    toDefaultString
};