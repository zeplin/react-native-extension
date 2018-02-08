import {
    HTML_TAGS
} from "../constants";

function escape(str) {
    return str.trim()
        .replace(/[^\s\w-]/g, "")
        .replace(/^(-?\d+)+/, "")
        .replace(/\s+/g, "-");
}

function isHtmlTag(str) {
    return HTML_TAGS.indexOf(str.toLowerCase()) > -1;
}

function round(number, precision) {
    let formattedNumber = Number(number).toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: precision
    });

    return Number(formattedNumber);
}

function selectorize(str) {
    if (!str) {
        return "";
    }

    let selectorizedStr = str.trim();

    if (isHtmlTag(str)) {
        return selectorizedStr.toLowerCase();
    }

    if (/^[#.]/.test(selectorizedStr)) {
        let name = escape(selectorizedStr.substr(1));

        if (name) {
            return selectorizedStr[0] + name;
        }
    }

    selectorizedStr = escape(selectorizedStr);

    return selectorizedStr && `.${selectorizedStr}`;
}

export {
    isHtmlTag,
    round,
    selectorize
};