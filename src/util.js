var HTML_TAGS = [
    "a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi",
    "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code",
    "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog",
    "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer",
    "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr",
    "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend",
    "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter",
    "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param",
    "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script",
    "section", "select", "slot", "small", "source", "source", "span", "strong", "style",
    "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea",
    "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"
];

var alphaFormatter = new Intl.NumberFormat("en-US", {
    useGrouping: false,
    maximumFractionDigits: 2
});

function joinTokens(components, namingScheme) {
    if (namingScheme === "camelCase" || namingScheme === "upperCamelCase") {
        var name = components.map(uppercaseFirst).join("");
        return namingScheme === "camelCase" ? lowercaseFirst(name) : name;
    } else if (namingScheme === "snakeCase") {
        return components.join("_");
    }
    return components.join("-");
}

var tokenizer = /\d+|[a-z]+|[A-Z]+(?![a-z])|[A-Z][a-z]+/g;

function tokensForString(str) {
    var matchResult = str.match(tokenizer);
    if (!matchResult) {
        return ["invalid", "name"];
    }

    return matchResult.map(function (token) {
        return token.toLowerCase();
    });
}

function generateName (name, namingScheme) {
    return joinTokens(tokensForString(name), namingScheme);
}

function layerHasGradient(layer) {
    return layer.fills.some(function (f) {
        return f.type === "gradient";
    });
}

function layerHasBlendMode(layer) {
    return layer.fills.some(function (f) {
        return f.blendMode && f.blendMode !== "normal";
    });
}

function blendColors(colors) {
    return colors.reduce(function (blendedColor, color) {
        return blendedColor.blend(color);
    });
}

function escape(str) {
    str = str.trim()
        .replace(/[^\s\w-]/g, "")
        .replace(/^(-?\d+)+/, "")
        .replace(/\s+/g, "-");

    return str;
}

function escapeHTML(str) {
    return str.replace(/&/gm, "&amp;")
              .replace(/</gm, "&lt;")
              .replace(/>/gm, "&gt;")
              .replace(/"/gm, "&quot;")
              .replace(/'/gm, "&apos;");
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
    var colorMap = {};

    colors.forEach(function (color) {
        var colorString = getColorStringByFormat(color, colorFormat);

        colorMap[colorString] = color.name;
    });

    return colorMap;
}

function isHtmlTag(str) {
    return HTML_TAGS.indexOf(str.toLowerCase()) > -1;
}

function lowercaseFirst(s) {
    return s.charAt(0).toLowerCase() + s.substring(1);
}

function round(number, precision) {
    var formattedNumber = Number(number).toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: precision
    });

    return Number(formattedNumber);
}

function selectorize(str) {
    if (!str) {
        return "";
    }

    str = str.trim();

    if (isHtmlTag(str)) {
        return str.toLowerCase();
    }

    if (/^[#.]/.test(str)) {
        var name = escape(str.substr(1));

        if (name) {
            return str[0] + name;
        }
    }

    str = escape(str);

    return str && "." + str;
}

function uppercaseFirst(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
}

function toHex(num) {
    num = Math.trunc(num + num / 255);
    num = Math.max(0, Math.min(num, 255));
    return (num < 16 ? "0" : "") + num.toString(16);
}

function toHexString(color, prefix) {
    var hexCode = color.hexBase();

    if (color.a < 1) {
        var hexA = toHex(color.a * 255);

        hexCode = prefix ? (hexA + hexCode) : (hexCode + hexA);
    }

    return "#" + hexCode;
}

function toRGBAString(color) {
    var rgb = Math.round(color.r) + ", " +
                Math.round(color.g) + ", " +
                Math.round(color.b);

    var rgbStr = color.a < 1
        ? "rgba(" + rgb + ", " + alphaFormatter.format(color.a)
        : "rgb(" + rgb;

    return rgbStr + ")";
}

function toHSLAString(color) {
    var hslColor = color.toHSL();
    var hsl = Math.round(hslColor.h * 360) + ", " +
              Math.round(hslColor.s * 100) + "%, " +
              Math.round(hslColor.l * 100) + "%";

    var hslStr = color.a < 1
        ? "hsla(" + hsl + ", " + alphaFormatter.format(color.a)
        : "hsl(" + hsl;

    return hslStr + ")";
}

export {
    blendColors,
    escape,
    escapeHTML,
    generateName,
    getColorMapByFormat,
    getColorStringByFormat,
    isHtmlTag,
    lowercaseFirst,
    round,
    selectorize,
    uppercaseFirst,
    toHexString,
    toRGBAString,
    toHSLAString,
    layerHasGradient,
    layerHasBlendMode
};